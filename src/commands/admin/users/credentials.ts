import { Flags } from "@oclif/core";
import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Credentials extends BaseCommand {
    static description = 'Update a user\'s password.';
    static examples = [
        `$ stash admin:users:credentials -a MyStashAlias --name "username" --password "password" --confirm "password" --json`,
        `$ stash admin:users:credentials -a MyStashAlias --name "username" --password "password" --confirm "password" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'Name of the user',
            required: true,
            name: 'Name'
        }),
        password: Flags.string({
            description: 'The new password to set',
            required: true,
            name: 'Password'
        }),
        confirm: Flags.string({
            description: 'The confirm password',
            required: true,
            name: 'Confirm'
        }),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.admin.users().changePassword({
                name: this.flags.name,
                password: this.flags.new,
                passwordConfirm: this.flags.new
            });
            response.status = 0;
            response.message = 'Password changes successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}