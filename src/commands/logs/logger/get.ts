import { Flags } from "@oclif/core";
import { Logger, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { LoggerColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve the current log level for a given logger. ' + UX.processDocumentation('<doc:Logger>');
    static examples = [
        `$ stash logs:logger:get -a MyStashAlias --name logName --json`,
        `$ stash logs:logger:get -a MyStashAlias --name logName --csv`,
        `$ stash logs:logger:get -a MyStashAlias --name logName`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'The name of the logger',
            required: true,
            name: 'Name',
        }),
    };
    async run(): Promise<StashCLIResponse<Logger>> {
        const response = new StashCLIResponse<Logger>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const logger = await connector.logs.logger().get(this.flags.name)
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