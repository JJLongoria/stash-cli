import { Flags } from "@oclif/core";
import { Comment, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommentColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieves a commit discussion comment. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ stash projects:repost:commits:comments:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --all --csv`,
        `$ stash projects:repost:commits:comments:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --path "file/path/to/get/comments" -l 100 -s 50 --json`,
        `$ stash projects:repost:commits:comments:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --since "ahs6sd2" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve repository commit comments',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the commit comments',
            required: true,
            name: 'Slug'
        }),
        commit: Flags.integer({
            description: 'The commit Id to retrieve comments',
            required: false,
            name: 'Commit Id',
        }),
        path: Flags.string({
            description: 'The file path to get comments from',
            required: false,
            name: 'Path',
        }),
        since: Flags.string({
            description: 'The Since commit id',
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
                let tmp = await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.pull).list({
                    path: this.flags.path,
                    since: this.flags.since,
                    pageOptions: this.allPageOptions,
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.pull).list({
                        path: this.flags.path,
                        since: this.flags.since,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.pull).list({
                    path: this.flags.path,
                    since: this.flags.since,
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Comment');
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