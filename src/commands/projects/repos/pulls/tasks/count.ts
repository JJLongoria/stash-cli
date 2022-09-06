import { Flags } from "@oclif/core";
import { StashConnector, TaskCountOutput } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { TaskCountColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Count extends BaseCommand {
    static description = 'Retrieve the total number of open and resolved tasks associated with a pull request. ' + UX.processDocumentation('<doc:TaskCountOutput>');
    static examples = [
        `$ stash projects:repos:pulls:tasks:count -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --csv`,
        `$ stash projects:repos:pulls:tasks:count -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
        `$ stash projects:repos:pulls:tasks:count -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to count repository pull requests Tasks',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to count the pull requests Tasks',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to count Tasks',
            required: true,
            name: 'Pull Request Id',
        }),
    };
    async run(): Promise<StashCLIResponse<TaskCountOutput>> {
        const response = new StashCLIResponse<TaskCountOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).tasks(this.flags.pull).count();
            response.result = result;
            response.status = 0;
            response.message = 'Tasks counts successfully';
            this.ux.log(response.message);
            this.ux.table<TaskCountOutput>([result], TaskCountColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}