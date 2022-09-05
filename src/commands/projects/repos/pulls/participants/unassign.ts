import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";

export default class Assign extends BaseCommand {
    static description = 'Assigns a participant to an explicit role in pull request. Currently only the REVIEWER role may be assigned.';
    static examples = [
        `$ stash projects:repos:pulls:participants:unassign -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --user "UserName" --json`,
        `$ stash projects:repos:pulls:participants:unassign -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --user "UserName"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to unassign participant to the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to unassign participant to the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to unassign participant to the pull request',
            required: true,
            name: 'Pull Request Id',
        }),
        user: Flags.string({
            description: 'The Participant name to unassign',
            required: true,
            name: 'User',
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const comment = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).participants(this.flags.pull).unassign(this.flags.user);
            response.result = comment;
            response.status = 0;
            response.message = 'Participant unassigned successfuly';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}