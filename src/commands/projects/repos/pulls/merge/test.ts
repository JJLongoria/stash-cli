import { Flags } from "@oclif/core";
import { PullRequest, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { PullRequestMergeColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Test extends BaseCommand {
    static description = 'Test whether a pull request can be merged. ' + UX.processDocumentation('<doc:PullRequest>');
    static examples = [
        `$ stash projects:repos:pulls:merge:test -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --csv`,
        `$ stash projects:repos:pulls:merge:test -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
        `$ stash projects:repos:pulls:merge:test -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to merge the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to merge the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to merge',
            required: true,
            name: 'Pull Request Id',
        }),
    };
    async run(): Promise<StashCLIResponse<PullRequest>> {
        const response = new StashCLIResponse<PullRequest>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const pullRequest = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).merge(this.flags.pull).test();
            response.status = 0;
            response.message = 'Pull Request Merge Tested successfully';
            this.ux.log(response.message);
            this.ux.table<PullRequest>([pullRequest], PullRequestMergeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}