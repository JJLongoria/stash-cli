import { Page, StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { UserColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of users. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash admin:users:list -a MyStashAlias --all`,
        `$ stash admin:users:list -a MyStashAlias -l 100 -s 50`,
        `$ stash admin:users:list -a MyStashAlias --filter "userName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only users with usernames, display name or email addresses containing the supplied string will be returned'),
    };
    async run(): Promise<StashCLIResponse<Page<User>>> {
        const response = new StashCLIResponse<Page<User>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<User> = new Page();
            if (this.flags.all) {
                let tmp = await connector.admin.users().list(this.flags.filter, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.admin.users().list(this.flags.filter, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.admin.users().list(this.flags.filter, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'User');
            console.log(response.message);
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