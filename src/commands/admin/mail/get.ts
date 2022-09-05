import { MailHostConfiguration, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { MailHostColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieves the server email address. ' + UX.processDocumentation('<doc:MailHostConfiguration>');
    static examples = [
        `$ stash admin:mail:get`,
        `$ stash admin:mail:get --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<MailHostConfiguration>> {
        const response = new StashCLIResponse<MailHostConfiguration>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const mailConfig = await connector.admin.mailServer().get();
            response.result = mailConfig;
            response.message = this.getRecordRetrievedText('Mail Configuration');
            response.status = 0;
            this.ux.log(response.message);
            this.ux.table<MailHostConfiguration>([mailConfig], MailHostColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}