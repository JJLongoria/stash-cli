import { Flags } from "@oclif/core";
import { Page, RepoChangesOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { RepoChangesColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Gets changes for the specified PullRequest. ' + UX.processDocumentation('<doc:RepoChangesOutput>');
    static examples = [
        `$ stash projects:repos:pulls:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --all --csv`,
        `$ stash projects:repos:pulls:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 -l 100 -s 50 --json`,
        `$ stash projects:repos:pulls:changes:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --from 5678 --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to retrieve repository pull requests changes',
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
                let tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).changes(this.flags.pull).list(!this.flags['without-comments'], this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).changes(this.flags.pull).list(!this.flags['without-comments'], {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).changes(this.flags.pull).list(!this.flags['without-comments'], this.pageOptions);
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