import { Flags } from "@oclif/core";
import { Group, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { GroupColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Delete extends BaseCommand {
    static description = 'Deletes the specified group, removing them from the system. This also removes any permissions that may have been granted to the group. ' + UX.processDocumentation('<doc:Group>');
    static examples = [
        `$ stash admin:groups:delete -a MyStashAlias --name MyGroup --json`,
        `$ stash admin:groups:delete -a MyStashAlias --name AnotherGroup --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'Name of the group to delete',
            required: true,
            name: 'Name'
        }),
    };
    async run(): Promise<StashCLIResponse<Group>> {
        const response = new StashCLIResponse<Group>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const group = await connector.admin.groups().delete(this.flags.name);
            response.result = group;
            response.status = 0;
            response.message = this.getRecordDeletedText('Group');
            this.ux.log(response.message);
            this.ux.table<Group>([group], GroupColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}