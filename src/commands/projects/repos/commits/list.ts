import { Flags } from "@oclif/core";
import { Commit, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { CommitColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of commits from a given starting commit or "between" two commits. If no explicit commit is specified, the tip of the repository\'s default branch is assumed ' + UX.processDocumentation('<doc:Commit>');
    static examples = [
        `$ stash projects:repos:commits:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --with-counts --all --csv`,
        `$ stash projects:repos:commits:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --path "path/to/the/file" -l 100 -s 50 --json`,
        `$ stash projects:repos:commits:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --since "ab4552nasj" --until "a5s6jasd5" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve forked repositories',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve forked repositories from',
            required: true,
            name: 'Slug'
        }),
        path: Flags.string({
            description: 'An optional path to filter commits by',
            required: false,
            name: 'Path'
        }),
        since: Flags.string({
            description: 'The commit ID or ref (exclusively) to retrieve commits after',
            required: false,
            name: 'Since'
        }),
        until: Flags.string({
            description: 'The commit ID (SHA1) or ref (inclusively) to retrieve commits before',
            required: false,
            name: 'Until'
        }),
        'with-counts': Flags.string({
            description: 'Optionally include the total number of commits and total number of unique authors',
            required: false,
            name: 'Since'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Commit>>> {
        const response = new StashCLIResponse<Page<Commit>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Commit> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).commits(this.flags.slug).list({
                    path: this.flags.path,
                    since: this.flags.since,
                    until: this.flags.until,
                    withCounts: this.flags['with-counts'],
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).commits(this.flags.slug).list({
                        path: this.flags.path,
                        since: this.flags.since,
                        until: this.flags.until,
                        withCounts: this.flags['with-counts'],
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).commits(this.flags.slug).list({
                    path: this.flags.path,
                    since: this.flags.since,
                    until: this.flags.until,
                    withCounts: this.flags['with-counts'],
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Commit');
            this.ux.log(response.message);
            this.ux.table<Commit>(result.values, CommitColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}