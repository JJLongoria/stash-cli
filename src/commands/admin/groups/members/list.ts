import { Flags } from "@oclif/core";
import { Page, StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { UserColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'List the members or non members from a group. By default, list all members' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash admin:groups:members:list -a MyStashAlias --filter "FilterValue" --members`,
        `$ stash admin:groups:members:list -a MyStashAlias --members --json --start 0 --limit 100`,
        `$ stash admin:groups:members:list -a MyStashAlias --no-members --csv --all --extended`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only users with usernames, display names or email addresses containing the supplied string will be returned'),
        context: BuildFlags.context('The group which should be used to locate members'),
        members: Flags.boolean({
            description: 'List group members. if use --no-members, will list all not member users',
            allowNo: true,
            required: false,
            default: true,
        }),
    };

    async run(): Promise<StashCLIResponse<Page<User>>> {
        const response = new StashCLIResponse<Page<User>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<User> = new Page();
            const options = {
                filter: this.flags.filter,
                context: this.flags.context,
                pageOptions: this.flags.all ? this.allPageOptions : this.pageOptions,
            };
            if (this.flags.all) {
                if (this.flags.members) {
                    let tmp = await connector.admin.groups().members(options);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.groups().members({
                            filter: this.flags.filter,
                            context: this.flags.context,
                            pageOptions: {
                                start: tmp.nextPageStart,
                                limit: 100,
                            },
                        });
                        result.values.push(...tmp.values);
                    }
                } else {
                    let tmp = await connector.admin.groups().nonMembers(options);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.groups().nonMembers({
                            filter: this.flags.filter,
                            context: this.flags.context,
                            pageOptions: {
                                start: tmp.nextPageStart,
                                limit: 100,
                            },
                        });
                        result.values.push(...tmp.values);
                    }
                }
                result.size = result.values.length;
            } else {
                if (this.flags.members) {
                    result = await connector.admin.groups().members(options);
                } else {
                    result = await connector.admin.groups().nonMembers(options);
                }
            }
            const message = this.getRecordsFoundText(result.values.length, 'User');
            response.result = result;
            response.status = 0;
            response.message = message;
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