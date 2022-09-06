import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Delete extends BaseCommand {
    static description = 'Delete the avatar associated to a user.');
    static examples = [
        `$ stash users:avatar:delete -a MyStashAlias --slug "userslug" --json`,
        `$ stash users:avatar:delete -a MyStashAlias --slug "userslug" --csv`,
        `$ stash users:avatar:delete -a MyStashAlias --slug "userslug"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        slug: Flags.string({
            description: 'The user slug to delete the avatar',
            required: true,
            name: 'User Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.users.avatar(this.flags.slug).delete();
            response.status = 0;
            response.message = this.getRecordDeletedText('User Avatar');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}