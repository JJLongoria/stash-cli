import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Unwatch extends BaseCommand {
    static description = 'Make the authenticated user stop watching the specified pull request.';
    static examples = [
        `$ stash projects:repos:pulls:unwatch -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
        `$ stash projects:repos:pulls:unwatch -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to watch the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to watch the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to watch',
            required: true,
            name: 'Pull Request Id',
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).watch(this.flags.pull).stop();
            response.status = 0;
            response.message = 'Stop Watching Pull Request successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}