import { Flags } from "@oclif/core";
import { AddGroupInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Remove extends BaseCommand {
    static description = 'Remove a user from a group.';
    static examples = [
        `$ stash admin:users:groups:remove -a MyStashAlias --user username --group group`,
        `$ stash admin:users:groups:remove -a MyStashAlias -u "username" -g "group" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        user: Flags.string({
            description: 'The user to remove from the group.',
            char: 'u',
            name: 'User',
            required: true,
        }),
        group: Flags.string({
            description: 'The group to remove user from.',
            char: 'g',
            name: 'Group',
            required: true,
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const message = 'User remove from the group successfully';
            await connector.admin.users().removeGroup(this.flags.user, this.flags.group);
            response.status = 0;
            response.message = message
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}