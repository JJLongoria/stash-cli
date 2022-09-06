import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { UserColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Update the currently authenticated user\'s details. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash users:update -a MyStashAlias --data "{'name':'jcitizen','displayName':'Jane Citizen','email':'jane@example.com'}" --json`,
        `$ stash users:update -a MyStashAlias --file "path/to/json/data/file" --csv`,
        `$ stash users:update -a MyStashAlias --data "{'displayName':'Jane Citizen','email':'jane@example.com'}" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:UserInput>', false),
        file: BuildFlags.input.jsonFile('<doc:UserInput>', false),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const user = await connector.users.update(this.getJSONInputData());
            response.result = user;
            response.status = 0;
            response.message = this.getRecordUpdatedText('User');
            this.ux.log(response.message);
            this.ux.table<User>([user], UserColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}