import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Watch extends BaseCommand {
    static description = 'Make the authenticated user watch the specified pull request.';
    static examples = [
        `$ stash projects:repos:commits:watch -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --json`,
        `$ stash projects:repos:commits:watch -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to watch the commit',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to watch the commit',
            required: true,
            name: 'Slug',
        }),
        commit: Flags.string({
            description: 'The commit id to watch',
            required: true,
            name: 'Commit'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).commits(this.flags.slug).watch(this.flags.commit).start();
            response.status = 0;
            response.message = 'Start Watching Commit successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}