import { Flags } from "@oclif/core";
import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { UserColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Rename extends BaseCommand {
    static description = 'Rename a user. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash admin:users:rename -a MyStashAlias --old "OldUserName" --new "NewUserName" --json`,
        `$ stash admin:users:rename -a MyStashAlias --old "OldUserName" --new "NewUserName" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        old: Flags.string({
            description: 'Old Name of the user',
            required: true,
            name: 'Old'
        }),
        new: Flags.string({
            description: 'New Name of the user',
            required: true,
            name: 'New'
        }),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const user = await connector.admin.users().rename(this.flags.old, this.flags.new);
            response.status = 0;
            response.message = this.getRecordUpdatedText('User');
            console.log(response.message);
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