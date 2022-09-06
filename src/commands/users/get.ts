import { Flags } from "@oclif/core";
import { StashConnector, User } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { UserColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve the user matching the supplied userSlug.. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ stash users:get -a MyStashAlias --slug "userslug" --json`,
        `$ stash users:get -a MyStashAlias --slug "userslug" --csv`,
        `$ stash users:get -a MyStashAlias --slug "userslug"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        slug: Flags.string({
            description: 'The user slug to retrieve',
            required: true,
            name: 'User Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<User>> {
        const response = new StashCLIResponse<User>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const user = await connector.users.get(this.flags.slug);
            response.result = user;
            response.status = 0;
            response.message = this.getRecordRetrievedText('User');
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