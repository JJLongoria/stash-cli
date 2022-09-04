import { Flags } from "@oclif/core";
import { AddUsersInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { UX } from "../../../../libs/core/ux";

export default class Add extends BaseCommand {
    static description = 'Add multiple users to a group. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash admin:groups:members:add -a MyStashAlias --data "{ 'group': 'GroupName', 'users': [ 'user1', 'user2', 'user3' ] }"`,
        `$ stash admin:groups:members:add -a MyStashAlias --file "path/to/json/data/file"`,
        `$ stash admin:groups:members:add -a MyStashAlias --group "GroupName" --users "user1, user2, user3"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.data('<doc:AddUserInput>', false, ['group', 'users']),
        file: BuildFlags.input.inputfile('<doc:AddUserInput>', false, ['group', 'users']),
        //keyvalue: BuildFlags.input.keyvalue('<doc:AddUserInput>', false, ['group', 'users']),
        group: Flags.string({
            description: 'The group name to add new members. ' + UX.cannotUseWith(['data', 'file', 'keyvalue']) + '. ' + UX.dependsOn(['users']),
            char: 'g',
            name: 'Group',
            dependsOn: ['users'],
        }),
        users: Flags.string({
            description: 'Comma separated user names to add to the group. ' + UX.dependsOn(['group']),
            char: 'u',
            name: 'Users',
            dependsOn: ['group'],
            parse: (input): any => {
                return BuildFlags.parseArray(input);
            }
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            console.log(this.flags.keyvalue);
            const dataToCreate: AddUsersInput = this.hasInputData() ? this.getInputData() : {
                group: this.flags.group,
                users: this.flags.users
            };
            const message = 'Users added to the group successfully';
            await connector.admin.groups().addUsers(dataToCreate);
            response.status = 0;
            response.message = message
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}