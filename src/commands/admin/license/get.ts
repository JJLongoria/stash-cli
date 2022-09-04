import { License, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { LicenseColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieves details about the current license, as well as the current status of the system with regards to the installed license. ' + UX.processDocumentation('<doc:License>');
    static examples = [
        `$ stash admin:license:get -a MyStashAlias --json`,
        `$ stash admin:license:get -a MyStashAlias --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
    };
    async run(): Promise<StashCLIResponse<License>> {
        const response = new StashCLIResponse<License>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const group = await connector.admin.license().get();
            response.result = group;
            response.status = 0;
            response.message = this.getRecordCreatedText('Group');
            console.log(response.message);
            this.ux.table<License>([group], LicenseColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}