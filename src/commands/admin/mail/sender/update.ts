import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Update extends BaseCommand {
    static description = 'Updates the server email address.';
    static examples = [
        `$ stash admin:mail:sender:update`,
        `$ stash admin:mail:sender:update --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        email: Flags.string({
            description: 'The new email address to set',
            required: true,
            name: 'Email'
        }),
    };
    async run(): Promise<StashCLIResponse<string>> {
        const response = new StashCLIResponse<string>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const email = await connector.admin.mailServer().senderAddress().update(this.flags.email);
            response.result = email;
            response.message = this.getRecordUpdatedText('Emai Address');
            response.status = 0;
            this.ux.log('New Email Address: ' + email);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}