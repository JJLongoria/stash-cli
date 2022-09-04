import { Flags } from "@oclif/core";
import { AddGroupInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { UX } from "../../../../libs/core/ux";

export default class Add extends BaseCommand {
    static description = 'Add User to a multiple groups. ' + UX.processDocumentation('<doc:AddGroupInput>');
    static examples = [
        `$ stash admin:users:groups:add -a MyStashAlias --data "{ 'user': 'username', 'groups': [ 'group1', 'group2', 'group3' ] }"`,
        `$ stash admin:users:groups:add -a MyStashAlias --file "path/to/json/data/file"`,
        `$ stash admin:users:groups:add -a MyStashAlias --user "username" --groups "group1, group2, group3"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.data('<doc:AddGroupInput>', false, ['groups', 'users']),
        file: BuildFlags.input.inputfile('<doc:AddGroupInput>', false, ['groups', 'users']),
        //keyvalue: BuildFlags.input.keyvalue('<doc:AddUserInput>', false, ['group', 'users']),
        user: Flags.string({
            description: 'The user name to add to the groups. ' + UX.cannotUseWith(['data', 'file', 'keyvalue']) + '. ' + UX.dependsOn(['users']),
            char: 'g',
            name: 'Group',
            dependsOn: ['groups'],
        }),
        groups: Flags.string({
            description: 'Comma separated group names to add to add the user. ' + UX.dependsOn(['user']),
            char: 'u',
            name: 'Users',
            dependsOn: ['user'],
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
            const dataToCreate: AddGroupInput = this.hasInputData() ? this.getInputData() : {
                groups: this.flags.groups,
                user: this.flags.user
            };
            const message = 'User added to the groups successfully';
            await connector.admin.users().addGroups(dataToCreate);
            response.status = 0;
            response.message = message
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}