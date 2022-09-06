import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Update extends BaseCommand {
    static description = 'Update the entries of a map of user setting key/values for a specific user identified by the user slug.';
    static examples = [
        `$ stash users:update -a MyStashAlias --data "{'strValue':'value', 'boolValue':false, 'numberValue':3}" --json`,
        `$ stash users:update -a MyStashAlias --file "path/to/json/data/file" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:UserInput>', false),
        file: BuildFlags.input.jsonFile('<doc:UserInput>', false),
        slug: Flags.string({
            description: 'The user slug to update settings',
            required: true,
            name: 'User Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.users.settings(this.flags.slug).update(this.getJSONInputData());
            response.status = 0;
            response.message = this.getRecordUpdatedText('User Settings');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}