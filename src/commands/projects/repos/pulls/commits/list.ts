import { Flags } from "@oclif/core";
import { Commit, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommitColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve changesets for the specified pull request. ' + UX.processDocumentation('<doc:Commit>');
    static examples = [
        `$ stash projects:repos:pulls:commits:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --all --csv`,
        `$ stash projects:repos:pulls:commits:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --with-counts -l 100 -s 50 --json`,
        `$ stash projects:repos:pulls:commits:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --from 5678 --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve repository pull requests commits',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull requests commits',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to retrieve commits',
            required: true,
            name: 'Pull Request Id',
        }),
        'with-counts': Flags.boolean({
            description: 'If set to true, the service will add "authorCount" and "totalCount" at the end of the page. "authorCount" is the number of different authors and "totalCount" is the total number of changesets.',
            required: false,
            name: 'With Counts',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Commit>>> {
        const response = new StashCLIResponse<Page<Commit>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Commit> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).commits(this.flags.pull).list(this.flags['with-counts'], this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).commits(this.flags.pull).list(this.flags['with-counts'], {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).commits(this.flags.pull).list(this.flags['with-counts'], this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Changes');
            this.ux.log(response.message);
            this.ux.table<Commit>(result.values, CommitColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}