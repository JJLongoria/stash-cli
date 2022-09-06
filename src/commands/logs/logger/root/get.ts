import { Flags } from "@oclif/core";
import { Logger, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { LoggerColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve the current log level for the root logger. ' + UX.processDocumentation('<doc:Logger>');
    static examples = [
        `$ stash logs:logger:root:get -a MyStashAlias --json`,
        `$ stash logs:logger:root:get -a MyStashAlias --csv`,
        `$ stash logs:logger:root:get -a MyStashAlias`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<Logger>> {
        const response = new StashCLIResponse<Logger>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const logger = await connector.logs.rootLogger().get()
            response.result = logger;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Logger Level');
            this.ux.log(response.message);
            this.ux.table<Logger>([logger], LoggerColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}