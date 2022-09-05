import { Flags } from "@oclif/core";
import { PullRequest, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PullRequestColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve a pull request. ' + UX.processDocumentation('<doc:PullRequest>');
    static examples = [
        `$ stash projects:repos:pulls:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --csv`,
        `$ stash projects:repos:pulls:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to retrieve',
            required: true,
            name: 'Pull Request Id',
        }),
    };
    async run(): Promise<StashCLIResponse<PullRequest>> {
        const response = new StashCLIResponse<PullRequest>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const pullRequest = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).get(this.flags.pull);
            response.result = pullRequest;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Pull Request');
            this.ux.log(response.message);
            this.ux.table<PullRequest>([pullRequest], PullRequestColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}