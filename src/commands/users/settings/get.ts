import { CliUx, Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { Utils } from "../../../libs/utils/utils";

export default class Get extends BaseCommand {
    static description = 'Rest resource for retrieving, and updating user settings key/values.';
    static examples = [
        `$ stash users:settings:get -a MyStashAlias --slug "userslug" --json`,
        `$ stash users:settings:get -a MyStashAlias --slug "userslug" --csv`,
        `$ stash users:settings:get -a MyStashAlias --slug "userslug"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        slug: Flags.string({
            description: 'The user slug to retrieve settings',
            required: true,
            name: 'User Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<{ [key: string]: string }>> {
        const response = new StashCLIResponse<{ [key: string]: string }>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const settings = await connector.users.settings(this.flags.slug).get();
            response.result = settings;
            response.status = 0;
            response.message = this.getRecordRetrievedText('User Settings');
            this.ux.log(response.message);
            const columns: CliUx.Table.table.Columns<Record<string, any>> = {};
            if (Utils.hasKeys(settings)) {
                for (const key of Object.keys(settings)) {
                    columns[key] = {
                        header: key,
                    }
                }
            }
            this.ux.table<{ [key: string]: string }>([settings], columns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}