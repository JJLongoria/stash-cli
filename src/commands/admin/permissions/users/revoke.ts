import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Revoke extends BaseCommand {
    static description = 'Promote or demote the global permission level of a user.';
    static examples = [
        `$ stash admin:permissions:users:revoke -a MyStashAlias --name Username --json`,
        `$ stash admin:permissions:users:revoke -a MyStashAlias --name OtherUser`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
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
            await connector.admin.permissions().users().revoke(this.flags.name);
            response.status = 0;
            response.message = 'User Permissions Revoked successfully';
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}