import { Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of group names.';
    static examples = [
        `$ stash groups:list -a MyStashAlias --all`,
        `$ stash groups:list -a MyStashAlias -l 100 -s 50`,
        `$ stash groups:list -a MyStashAlias --filter "groupName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only group names containing the supplied string will be returned'),
    };
    async run(): Promise<StashCLIResponse<Page<string>>> {
        const response = new StashCLIResponse<Page<string>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<string> = new Page();
            if (this.flags.all) {
                let tmp = await connector.groups.list(this.flags.filder, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.groups.list(this.flags.filter, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.groups.list(this.flags.filter, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Group');
            this.ux.log(response.message);
            this.ux.table<string>(result.values, {
                group: {
                    header: 'Group'
                }
            }, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}