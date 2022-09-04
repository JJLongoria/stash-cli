import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Get extends BaseCommand {
    static description = 'Retrieves the server email address.';
    static examples = [
        `$ stash admin:mail:sender:get`,
        `$ stash admin:mail:sender:get --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<string>> {
        const response = new StashCLIResponse<string>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const email = await connector.admin.mailServer().senderAddress().get();
            response.result = email;
            response.message = this.getRecordRetrievedText('Emai Address');
            response.status = 0;
            console.log('Email Address: ' + email);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}