import { Flags } from "@oclif/core";
import { PullRequest, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PullRequestColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Decline extends BaseCommand {
    static description = 'Re-open a declined pull request. ' + UX.processDocumentation('<doc:PullRequest>');
    static examples = [
        `$ stash projects:repos:pulls:reopen -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --csv`,
        `$ stash projects:repos:pulls:reopen -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
        `$ stash projects:repos:pulls:reopen -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --version 1`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to reopen the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to reopen the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to reopen',
            required: true,
            name: 'Pull Request Id',
        }),
        version: Flags.integer({
            description: 'The current version of the pull request. If the server\'s version isn\'t the same as the specified version the operation will fail. To determine the current version of the pull request it should be fetched from the server prior to this operation. Look for the "version" attribute in the returned JSON structure',
            required: false,
            name: 'Version',
            default: -1,
        }),
    };
    async run(): Promise<StashCLIResponse<PullRequest>> {
        const response = new StashCLIResponse<PullRequest>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const pullRequest = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).reopen(this.flags.pull).execute(this.flags.version);
            response.status = 0;
            response.message = 'Pull Request Reopened successfully';
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