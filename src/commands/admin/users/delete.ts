import { Flags } from "@oclif/core";
import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { UserColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Delete extends BaseCommand {
    static description = 'Deletes the specified user, removing them from the system. This also removes any permissions that may have been granted to the user. ' + UX.processDocumentation('<doc:Group>');
    static examples = [
        `$ stash admin:users:delete -a MyStashAlias --name john.smith --json`,
        `$ stash admin:users:delete -a MyStashAlias --name gina.smith --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'Name of the user to delete',
            required: true,
            name: 'Name'
        }),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const user = await connector.admin.users().delete(this.flags.name);
            response.result = user;
            response.status = 0;
            response.message = this.getRecordDeletedText('User');
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