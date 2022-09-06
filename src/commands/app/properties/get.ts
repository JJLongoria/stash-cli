import { ApplicationProperties, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { AppPropertiesColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve version information and other application properties. ' + UX.processDocumentation('<doc:ApplicationProperties>');
    static examples = [
        `$ stash app:properties:get -a MyStashAlias --json`,
        `$ stash app:properties:get -a MyStashAlias --csv`,
        `$ stash app:properties:get -a MyStashAlias`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<ApplicationProperties>> {
        const response = new StashCLIResponse<ApplicationProperties>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const appProperties = await connector.applicationProperties.get();
            response.result = appProperties;
            response.status = 0;
            response.message = 'License retrieved succesffully';
            this.ux.log(response.message);
            this.ux.table<ApplicationProperties>([appProperties], AppPropertiesColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}