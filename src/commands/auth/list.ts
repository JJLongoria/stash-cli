import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { InstanceColumns } from "../../libs/core/tables";
import { Instance } from "../../libs/types";

export default class List extends BaseCommand {
    static description = 'List al authorized Stash instances.';
    static examples = [
        `$ stash auth:list`,
        `$ stash auth:list`,
        `$ stash auth:list`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
    };
    async run(): Promise<StashCLIResponse<Instance[]>> {
        const response = new StashCLIResponse<Instance[]>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            response.result = Object.values(this.localConfig.instances);
            response.status = 0;
            response.message = this.getRecordsFoundText(response.result.length, 'Instance');
            this.ux.log(response.message);
            this.ux.table<Instance>(response.result, InstanceColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}