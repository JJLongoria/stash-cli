import { Flags } from "@oclif/core";
import { Page, PermissionUserOutput, PermissionUsersOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { PermissionUserColumns, PermissionUsersColumns, UserColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of users that have been granted at least one permission for the specified repository or retrieve a page of licensed users that have no granted permissions for the specified repository. ' + UX.processDocumentation('<doc:PermissionUsersOutput>');
    static examples = [
        `$ stash projects:repos:permissions:users:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all`,
        `$ stash projects:repos:permissions:users:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --none -l 100 -s 50`,
        `$ stash projects:repos:permissions:users:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --filter "userName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to get the users',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository to get the users',
            required: true,
            name: 'Slug'
        }),
        filter: BuildFlags.filter('If specified only user names containing the supplied string will be returned'),
        none: Flags.boolean({
            description: 'Retrieve a page of users that have no granted global permissions. ' + UX.processDocumentation('<doc:PermissionUserOutput>'),
            required: false,
            name: 'None'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<PermissionUsersOutput | PermissionUserOutput>>> {
        const response = new StashCLIResponse<Page<PermissionUsersOutput | PermissionUserOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<PermissionUsersOutput | PermissionUserOutput> = new Page();
            if (this.flags.all) {
                if (this.flags.none) {
                    let tmp = await connector.projects.repos(this.flags.project).permissions(this.flags.slug).users().none(this.flags.filter, this.allPageOptions);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.projects.repos(this.flags.project).permissions(this.flags.slug).users().none(this.flags.filter, {
                            start: tmp.nextPageStart,
                            limit: 100,
                        });
                        result.values.push(...tmp.values);
                    }
                } else {
                    let tmp = await connector.projects.repos(this.flags.project).permissions(this.flags.slug).users().list(this.flags.filter, this.allPageOptions);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.projects.repos(this.flags.project).permissions(this.flags.slug).users().list(this.flags.filter, {
                            start: tmp.nextPageStart,
                            limit: 100,
                        });
                        result.values.push(...tmp.values);
                    }
                }
                result.size = result.values.length;
            } else {
                if (this.flags.none) {
                    result = await connector.projects.repos(this.flags.project).permissions(this.flags.slug).users().none(this.flags.filter, this.pageOptions);
                } else {
                    result = await connector.projects.repos(this.flags.project).permissions(this.flags.slug).users().list(this.flags.filter, this.pageOptions);
                }
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'User Permissions');
            this.ux.log(response.message);
            if (this.flags.none) {
                this.ux.table<PermissionUserOutput>(result.values, PermissionUserColumns, {
                    csv: this.flags.csv,
                    extended: this.flags.extended || this.flags.csv
                });
            } else {
                this.ux.table<PermissionUsersOutput>(result.values, PermissionUsersColumns, {
                    csv: this.flags.csv,
                    extended: this.flags.extended || this.flags.csv
                });
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}