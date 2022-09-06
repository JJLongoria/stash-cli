import { Flags } from "@oclif/core";
import { StashConnector, Task } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { TaskColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Delete extends BaseCommand {
    static description = 'Delete a task. ' + UX.processDocumentation('<doc:Task>');
    static examples = [
        `$ stash tasks:delete -a MyStashAlias --task 1234 --json`,
        `$ stash tasks:delete -a MyStashAlias --task 1234 --csv`,
        `$ stash tasks:delete -a MyStashAlias --task 1234`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        task: Flags.string({
            description: 'The task id to delete',
            required: true,
            name: 'Task Id'
        }),
    };
    async run(): Promise<StashCLIResponse<Task>> {
        const response = new StashCLIResponse<Task>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const task = await connector.tasks.get(this.flags.task);
            response.result = task;
            response.status = 0;
            response.message = this.getRecordDeletedText('Task');
            this.ux.log(response.message);
            this.ux.table<Task>([task], TaskColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}