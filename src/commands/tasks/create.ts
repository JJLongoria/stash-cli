import { StashConnector, Task } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { TaskColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Create a new task. ' + UX.processDocumentation('<doc:Task>');
    static examples = [
        `$ stash tasks:create -a MyStashAlias --data "{ 'text': 'TaskTest', 'anchor':{ 'id': 1, 'type': 'COMMENT'  }, 'state': 'OPEN' }" --json`,
        `$ stash tasks:create -a MyStashAlias --file "path/to/json/data/file" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:TaskInput>', false),
        file: BuildFlags.input.jsonFile('<doc:TaskInput>', false),
    };
    async run(): Promise<StashCLIResponse<Task>> {
        const response = new StashCLIResponse<Task>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const task = await connector.tasks.create(this.getJSONInputData());
            response.result = task;
            response.status = 0;
            response.message = this.getRecordCreatedText('Project');
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