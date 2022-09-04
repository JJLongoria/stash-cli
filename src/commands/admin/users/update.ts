import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { UserColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Update a user\'s details. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash admin:users:update -a MyStashAlias --data "{ 'name':'UserName', 'displayName':'Name', 'emailAddress':'user@email.com', 'addToDefaultGroup':false, 'notify':false }" --json`,
        `$ stash admin:users:update -a MyStashAlias --file "path/to/json/data/file"`,
        `$ stash admin:users:update -a MyStashAlias --data "{ 'name':'UserName', 'displayName':'Name', 'emailAddress':'user@email.com', 'addToDefaultGroup':false, 'notify':false }" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.data('<doc:User>', false),
        file: BuildFlags.input.inputfile('<doc:User>', false),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const userInput = this.getInputData() as User;
            const user = await connector.admin.users().update(userInput);
            response.status = 0;
            response.message = this.getRecordUpdatedText('User');
            console.log(response.message);
            this.ux.table<User>([user], UserColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended && !this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}