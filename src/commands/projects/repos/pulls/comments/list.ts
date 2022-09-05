import { Flags } from "@oclif/core";
import { Comment, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommentColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of comments made in a specified pull request. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ stash projects:repost:pulls:comments:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --all --csv`,
        `$ stash projects:repost:pulls:comments:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --path "file/path/to/get/commands" -l 100 -s 50 --json`,
        `$ stash projects:repost:pulls:comments:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve repository pull requests changes',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull requests changes',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to retrieve changes',
            required: true,
            name: 'Pull Request Id',
        }),
        path: Flags.string({
            description: 'the file path to get comments from',
            required: false,
            name: 'Path',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Comment>>> {
        const response = new StashCLIResponse<Page<Comment>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Comment> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).comments(this.flags.pull).list(this.flags.path, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).comments(this.flags.pull).list(this.flags.path, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).comments(this.flags.pull).list(this.flags.path, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Changes');
            this.ux.log(response.message);
            this.ux.table<Comment>(result.values, CommentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}