import { Flags } from "@oclif/core";
import { Group, StashConnector } from "stash-connector";
import { BaseCommand, BuildCommands } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { GroupColumns } from "../../../libs/core/tables";



export default class Create extends BaseCommand {
    static description = 'Create a new group.'
    static examples = [
        `$ stash admin:groups:create -a MyStashAlias --name MyGroup --json`,
        `$ stash admin:groups:create -a MyStashAlias --name AnotherGroup --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildCommands.csv,
        alias: BuildCommands.alias,
        name: Flags.string({
            description: 'Name of the group to create',
            required: true,
            name: 'Name'
        }),
    };
    async run(): Promise<StashCLIResponse<Group>> {
        const response = new StashCLIResponse<Group>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const group = await connector.admin.groups().create(this.flags.name);
            response.result = group;
            response.status = 0;
            this.ux.table<Group>([group], GroupColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}