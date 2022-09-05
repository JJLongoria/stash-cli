import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Revoke extends BaseCommand {
    static description = 'Revoke all global permissions for a group.';
    static examples = [
        `$ stash admin:permissions:groups:revoke -a MyStashAlias --name groupName --json`,
        `$ stash admin:permissions:groups:revoke -a MyStashAlias --name otherGroup`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'The name of the group',
            required: true,
            name: 'Name'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.admin.permissions().groups().revoke(this.flags.name);
            response.status = 0;
            response.message = 'Group Permissions Revoked successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}