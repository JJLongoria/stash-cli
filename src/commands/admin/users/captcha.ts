import { Flags } from "@oclif/core";
import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Captcha extends BaseCommand {
    static description = 'Clears any CAPTCHA challenge that may constrain the user with the supplied username when they authenticate. Additionally any counter or metric that contributed towards the user being issued the CAPTCHA challenge (for instance too many consecutive failed logins) will also be reset.';
    static examples = [
        `$ stash admin:users:captcha -a MyStashAlias --name "UserName" --json`,
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
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.admin.users().captcha(this.flags.name);
            const message = 'Captcha Challenge cleared successfully';
            response.status = 0;
            response.message = message;
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}