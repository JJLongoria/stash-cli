import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Delete extends BaseCommand {
    static description = 'Deletes the current mail configuration.';
    static examples = [
        `$ stash admin:mail:delete`,
        `$ stash admin:mail:delete --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.admin.mailServer().delete();
            response.message = this.getRecordDeletedText('Mail Configuration');
            response.status = 0;
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}