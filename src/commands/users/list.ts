import { Flags } from "@oclif/core";
import { Page, StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { UserColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of users, optionally run through provided filters. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash users:list -a MyStashAlias --all --csv`,
        `$ stash users:list -a MyStashAlias --filter "userName" -l 100 -s 50 --json`,
        `$ stash users:list -a MyStashAlias --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('return only users, whose username, name or email address contain the filter value'),
    };
    async run(): Promise<StashCLIResponse<Page<User>>> {
        const response = new StashCLIResponse<Page<User>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<User> = new Page();
            if (this.flags.all) {
                let tmp = await connector.users.list(this.flags.filter, this.pageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.users.list(this.flags.filter, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.users.list(this.flags.filter, this.allPageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'User');
            this.ux.log(response.message);
            this.ux.table<User>(result.values, UserColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}