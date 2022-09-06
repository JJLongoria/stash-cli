import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Decline extends BaseCommand {
    static description = 'Decline a pull request.';
    static examples = [
        `$ stash projects:repos:pulls:decline -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --csv`,
        `$ stash projects:repos:pulls:decline -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
        `$ stash projects:repos:pulls:decline -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --version 1`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to decline the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to decline the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to decline',
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
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).decline(this.flags.pull).execute(this.flags.version);
            response.status = 0;
            response.message = 'Pull Request Declined successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}