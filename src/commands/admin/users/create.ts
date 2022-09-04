import { Flags } from "@oclif/core";
import { CreateUserInput, Group, StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { GroupColumns, UserColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Creates a new user. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash admin:users:create -a MyStashAlias --data "{ 'name':'UserName', 'password':'pass', 'displayName':'Name', 'emailAddress':'user@email.com', 'addToDefaultGroup':false, 'notify':false }" --json`,
        `$ stash admin:users:create -a MyStashAlias --file "path/to/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.data('<doc:CreateUserInput>', false),
        file: BuildFlags.input.inputfile('<doc:CreateUserInput>', false),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const userInput = this.getInputData() as CreateUserInput;
            await connector.admin.users().create(userInput);
            response.status = 0;
            response.message = this.getRecordCreatedText('User');
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}