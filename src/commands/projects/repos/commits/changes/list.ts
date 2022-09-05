import { Flags } from "@oclif/core";
import { Page, RepoChangesOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { RepoChangesColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of changes made in a specified commit. ' + UX.processDocumentation('<doc:RepoChangesOutput>');
    static examples = [
        `$ stash projects:repos:commits:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --without-comments --all --csv`,
        `$ stash projects:repos:commits:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" -l 100 -s 50 --json`,
        `$ stash projects:repos:commits:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --since "ab4552nasj" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve commit changes',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve commit changes',
            required: true,
            name: 'Slug'
        }),
        commit: Flags.string({
            description: 'The commit id to retrieve changes',
            required: true,
            name: 'Commit'
        }),
        since: Flags.string({
            description: 'The commit to which until should be compared to produce a page of changes. If not specified the commit\'s first parent is assumed (if one exists)',
            required: false,
            name: 'Since'
        }),
        'without-comments': Flags.boolean({
            description: 'true to apply comment counts in the changes (the default); otherwise, false to stream changes without comment counts',
            required: false,
            name: 'With Comments',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<RepoChangesOutput>>> {
        const response = new StashCLIResponse<Page<RepoChangesOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<RepoChangesOutput> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).commits(this.flags.slug).changes(this.flags.commit).list({
                    since: this.flags.since,
                    withComments: !this.flags['without-comments'],
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).commits(this.flags.slug).changes(this.flags.commit).list({
                        since: this.flags.since,
                        withComments: !this.flags['without-comments'],
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).commits(this.flags.slug).changes(this.flags.commit).list({
                    since: this.flags.since,
                    withComments: !this.flags['without-comments'],
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Changes');
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