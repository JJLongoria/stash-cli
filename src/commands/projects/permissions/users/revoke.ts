import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Revoke extends BaseCommand {
    static description = 'Revoke all permissions for the specified project for a user.';
    static examples = [
        `$ stash projects:permissions:users:revoke -a MyStashAlias --project "ProjectKey" --name Username --json`,
        `$ stash projects:permissions:users:revoke -a MyStashAlias --project "ProjectKey" --name OtherUser`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to revoke user permissions',
            required: true,
            name: 'Project'
        }),
        name: Flags.string({
            description: 'The name of the user',
            required: true,
            name: 'Name'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.permissions(this.flags.project).users().revoke(this.flags.name);
            response.status = 0;
            response.message = 'User Permissions Revoked successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}