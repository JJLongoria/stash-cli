import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Update extends BaseCommand {
    static description = 'Promote or demote the global permission level of a user.';
    static examples = [
        `$ stash admin:permissions:groups:update -a MyStashAlias --name groupName --permission 'ADMIN' --json`,
        `$ stash admin:permissions:groups:update -a MyStashAlias --name otherGroup --permission PROJECT_CREATE`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'The name of the group',
            required: true,
            name: 'Name'
        }),
        permission: Flags.string({
            description: 'The permission to grant',
            type: "option",
            options: ['LICENSED_USER', 'PROJECT_CREATE', 'ADMIN', 'SYS_ADMIN'],
            required: true,
            name: 'Permission'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.admin.permissions().groups().update(this.flags.name, this.flags.permission);
            response.status = 0;
            response.message = this.getRecordUpdatedText('Group Permissions');
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}