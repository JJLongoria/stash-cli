import { Flags } from "@oclif/core";
import { Page, Group, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { GroupColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of groups. ' + UX.processDocumentation('<doc:Group>');
    static examples = [
        `$ stash admin:groups:list -a MyStashAlias --all`,
        `$ stash admin:groups:list -a MyStashAlias -l 100 -s 50`,
        `$ stash admin:groups:list -a MyStashAlias --filter "groupName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only group names containing the supplied string will be returned'),
    };
    async run(): Promise<StashCLIResponse<Page<Group>>> {
        const response = new StashCLIResponse<Page<Group>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Group> = new Page();
            if (this.flags.all) {
                let tmp = await connector.admin.groups().list(this.flags.filter, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.admin.groups().list(this.flags.filter, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.admin.groups().list(this.flags.filter, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Group');
            this.ux.log(response.message);
            this.ux.table<Group>(result.values, GroupColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}