import { License, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { LicenseColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Decodes the provided encoded license and sets it as the active license. ' + UX.processDocumentation('<doc:License>');
    static examples = [
        `$ stash admin:license:update -a MyStashAlias --data "Encoded license to update" --json`,
        `$ stash admin:license:update -a MyStashAlias --file "path/to/the/encoded/license/data" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.data('', false),
        file: BuildFlags.input.file('', false),
    };
    async run(): Promise<StashCLIResponse<License>> {
        const response = new StashCLIResponse<License>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const group = await connector.admin.license().update(this.getInputData());
            response.result = group;
            response.status = 0;
            response.message = this.getRecordUpdatedText('License');
            this.ux.log(response.message);
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