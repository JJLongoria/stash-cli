import { Flags } from "@oclif/core";
import { ChangeUserPasswordInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";

export default class Update extends BaseCommand {
    static description = 'Update the currently authenticated user\'s password.';
    static examples = [
        `$ stash users:credentials -a MyStashAlias --data "{'password':'newPass','passwordConfirm':'newPass','oldPassword':'oldPass'}" --json`,
        `$ stash users:credentials -a MyStashAlias --file "path/to/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:ChangeUserPasswordInput>', false, ['password', 'confirm', 'old']),
        file: BuildFlags.input.jsonFile('<doc:ChangeUserPasswordInput>', false, ['password', 'confirm', 'old']),
        password: Flags.string({
            description: 'The new password',
            required: false,
            name: 'Password',
            exclusive: ['data', 'file'],
            dependsOn: ['confirm', 'old'],
        }),
        confirm: Flags.string({
            description: 'The new password confirm',
            required: false,
            name: 'Password',
            exclusive: ['data', 'file'],
            dependsOn: ['password', 'old'],
        }),
        old: Flags.string({
            description: 'The old password',
            required: false,
            name: 'Password',
            exclusive: ['data', 'file'],
            dependsOn: ['password', 'confirm'],
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let inputData: ChangeUserPasswordInput;
            if(this.hasInputData()){
                inputData = this.getInputData();
            } else {
                inputData = {
                    password: this.flags.password,
                    oldPassword: this.flags.old,
                    passwordConfirm: this.flags.confirm,
                };
            }
            await connector.users.changePassword(inputData);
            response.status = 0;
            response.message = this.getRecordUpdatedText('User Password');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}