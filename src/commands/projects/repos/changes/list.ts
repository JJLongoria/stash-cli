import { Flags } from "@oclif/core";
import { Page, RepoChangesOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { RepoChangesColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of changes made in a specified commit. ' + UX.processDocumentation('<doc:RepoChangesOutput>');
    static examples = [
        `$ stash projects:repos:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --since <sinceCommitId> -l 100 -s 50 --json`,
        `$ stash projects:repos:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --since <sinceCommitId> --until <untilCommitId> --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to retrieve repository branches',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the branches',
            required: true,
            name: 'Slug'
        }),
        since: Flags.string({
            description: 'The commit to which until should be compared to produce a page of changes. If not specified the commit\'s first parent is assumed (if one exists)',
            required: false,
            name: 'Since'
        }),
        until: Flags.boolean({
            description: 'The commit to retrieve changes for',
            required: false,
            name: 'Until'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<RepoChangesOutput>>> {
        const response = new StashCLIResponse<Page<RepoChangesOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<RepoChangesOutput> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).changes(this.flags.slug).list({
                    since: this.flags.since,
                    until: this.flags.until,
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).changes(this.flags.slug).list({
                        since: this.flags.since,
                        until: this.flags.until,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).changes(this.flags.slug).list({
                    since: this.flags.since,
                    until: this.flags.until,
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Change');
            this.ux.log(response.message);
            this.ux.table<RepoChangesOutput>(result.values, RepoChangesColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}