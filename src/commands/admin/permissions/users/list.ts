import { Flags } from "@oclif/core";
import { Page, PermissionUsersOutput, StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { UserColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of Users with at least one permission, or retrieve a page of users without any permission. ' + UX.processDocumentation('<doc:PermissionUsersOutput>');
    static examples = [
        `$ stash admin:permissions:users:list -a MyStashAlias --all`,
        `$ stash admin:permissions:users:list -a MyStashAlias -l 100 -s 50`,
        `$ stash admin:permissions:users:list -a MyStashAlias --filter "groupName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only user names containing the supplied string will be returned'),
        none: Flags.boolean({
            description: 'Retrieve a page of users that have no granted global permissions',
            name: 'None'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<PermissionUsersOutput>>> {
        const response = new StashCLIResponse<Page<PermissionUsersOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<PermissionUsersOutput> = new Page();
            if (this.flags.all) {
                if (this.flags.none) {
                    let tmp = await connector.admin.permissions().users().none(this.flags.filter, this.allPageOptions);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.permissions().users().none(this.flags.filter, {
                            start: tmp.nextPageStart,
                            limit: 100,
                        });
                        result.values.push(...tmp.values);
                    }
                } else {
                    let tmp = await connector.admin.permissions().users().list(this.flags.filter, this.allPageOptions);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.permissions().users().list(this.flags.filter, {
                            start: tmp.nextPageStart,
                            limit: 100,
                        });
                        result.values.push(...tmp.values);
                    }
                }
                result.size = result.values.length;
            } else {
                if (this.flags.none) {
                    result = await connector.admin.permissions().users().none(this.flags.filter, this.pageOptions);
                } else {
                    result = await connector.admin.permissions().users().list(this.flags.filter, this.pageOptions);
                }
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'User Permissions');
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