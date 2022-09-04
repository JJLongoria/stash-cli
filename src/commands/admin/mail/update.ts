import { MailHostConfiguration, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { MailHostColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Updates the mail configuration. ' + UX.processDocumentation('<doc:MailHostConfiguration>');
    static examples = [
        `$ stash admin:mail:update --data "{ 'username': 'user', 'sender-address': 'address@email.com' 'hostname': 'host', 'port': 4000, protocol: 'SMTP', 'use-start-tls': true, 'require-start-tls': true }"`,
        `$ stash admin:mail:update --file "path/to/json/data/file" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:MailHostConfiguration>', false),
        file: BuildFlags.input.jsonFile('<doc:MailHostConfiguration>', false)
    };
    async run(): Promise<StashCLIResponse<MailHostConfiguration>> {
        const response = new StashCLIResponse<MailHostConfiguration>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const mailConfig = await connector.admin.mailServer().update(this.getJSONInputData());
            response.message = this.getRecordUpdatedText('Mail Configuration');
            response.status = 0;
            console.log(response.message);
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