import { Flags } from "@oclif/core";
import { Page, Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { RepositoryColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of repositories based on query parameters that control the search. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash repos:list -a MyStashAlias --project "TheProjectName" --all --csv`,
        `$ stash repos:list -a MyStashAlias --project "TheProjectName" --permission REPO_READ -l 100 -s 50 --json`,
        `$ stash repos:list -a MyStashAlias --visibility public --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        name: Flags.string({
            description: ' If specified, this will limit the resulting repository list to ones whose name matches this parameter\'s value. The match will be done case-insensitive and any leading and/or trailing whitespace characters on the name parameter will be stripped.',
            required: false,
            name: 'Name'
        }),
        project: Flags.string({
            description: 'If specified, this will limit the resulting repository list to ones whose project\'s name matches this parameter\'s value. The match will be done case-insensitive and any leading and/or trailing whitespace characters on the projectname parameter will be stripped',
            required: false,
            name: 'Project'
        }),
        permission: Flags.string({
            description: 'If specified, it must be a valid repository permission level name and will limit the resulting repository list to ones that the requesting user has the specified permission level to. If not specified, the default implicit "read" permission level will be assumed.',
            required: false,
            options: ['REPO_READ', 'REPO_WRITE', 'REPO_ADMIN'],
            type: "option",
            name: 'Permission'
        }),
        visibility: Flags.string({
            description: 'If specified, this will limit the resulting repository list based on the repositories visibility',
            required: false,
            options: ['private', 'public'],
            type: "option",
            name: 'Visibility'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Repository>>> {
        const response = new StashCLIResponse<Page<Repository>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Repository> = new Page();
            if (this.flags.all) {
                let tmp = await connector.repos.list({
                    name: this.flags.name,
                    permission: this.flags.permission,
                    projectname: this.flags.project,
                    visibility: this.flags.visibility,
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.repos.list({
                        name: this.flags.name,
                        permission: this.flags.permission,
                        projectname: this.flags.project,
                        visibility: this.flags.visibility,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.repos.list({
                    name: this.flags.name,
                    permission: this.flags.permission,
                    projectname: this.flags.project,
                    visibility: this.flags.visibility,
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Repository');
            this.ux.log(response.message);
            this.ux.table<Repository>(result.values, RepositoryColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}