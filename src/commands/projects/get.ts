import { Flags } from "@oclif/core";
import { Project, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { ProjectColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve the project matching the supplied projectKey. ' + UX.processDocumentation('<doc:Project>');
    static examples = [
        `$ stash projects:get -a MyStashAlias --key "ProjectKey" --csv`,
        `$ stash projects:get -a MyStashAlias --key "ProjectKey" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Project key to retrieve',
            required: true,
            name: 'Key'
        }),
    };
    async run(): Promise<StashCLIResponse<Project>> {
        const response = new StashCLIResponse<Project>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const project = await connector.projects.get(this.flags.key);
            response.result = project;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Project');
            console.log(response.message);
            this.ux.table<Project>([project], ProjectColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}