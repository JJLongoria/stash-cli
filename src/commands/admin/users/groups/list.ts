import { Flags } from "@oclif/core";
import { Group, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { GroupColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'List the groups in which the user is or is not a member. By default, list all the user groups' + UX.processDocumentation('<doc:Group>');
    static examples = [
        `$ stash admin:users:groups:list -a MyStashAlias --filter "FilterValue" --member`,
        `$ stash admin:users:groups:list -a MyStashAlias --member --json --start 0 --limit 100`,
        `$ stash admin:users:groups:list -a MyStashAlias --no-member --csv --all --extended`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only groups with names containing the supplied string will be returned'),
        context: BuildFlags.context('The user which should be used to locate groups'),
        member: Flags.boolean({
            description: 'List of groups the specified user is a member of. if use --no-member, list of groups the specified user is not a member of',
            allowNo: true,
            required: false,
            default: true,
        }),
    };

    async run(): Promise<StashCLIResponse<Page<Group>>> {
        const response = new StashCLIResponse<Page<Group>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Group> = new Page();
            const options = {
                filter: this.flags.filter,
                context: this.flags.context,
                pageOptions: this.flags.all ? this.allPageOptions : this.pageOptions,
            };
            if (this.flags.all) {
                if (this.flags.members) {
                    let tmp = await connector.admin.users().groups(options);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.users().groups({
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
                    let tmp = await connector.admin.users().nonGroups(options);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.users().nonGroups({
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
                    result = await connector.admin.users().groups(options);
                } else {
                    result = await connector.admin.users().nonGroups(options);
                }
            }
            const message = this.getRecordsFoundText(result.values.length, 'Group');
            response.result = result;
            response.status = 0;
            response.message = message;
            this.ux.log(response.message);
            this.ux.table<Group>(result.values, GroupColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}