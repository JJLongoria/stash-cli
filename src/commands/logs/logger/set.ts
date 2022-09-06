import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Set extends BaseCommand {
    static description = 'Set the current log level for a given logger.';
    static examples = [
        `$ stash logs:logger:get -a MyStashAlias --name logName --json`,
        `$ stash logs:logger:get -a MyStashAlias --name logName`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'The name of the logger',
            required: true,
            name: 'Name',
        }),
        level: Flags.string({
            description: 'The level to set the logger to',
            required: true,
            type: "option",
            options: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'],
            name: 'Level',
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.logs.logger().changeLevel(this.flags.name, this.flags.level)
            response.status = 0;
            response.message = this.getRecordUpdatedText('Logger Level');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}