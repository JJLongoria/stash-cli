import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Delete extends BaseCommand {
    static description = 'Clears the server email address.';
    static examples = [
        `$ stash admin:mail:sender:delete`,
        `$ stash admin:mail:sender:delete --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<string>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.admin.mailServer().senderAddress().delete();
            response.message = this.getRecordDeletedText('Emai Address');
            response.status = 0;
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}