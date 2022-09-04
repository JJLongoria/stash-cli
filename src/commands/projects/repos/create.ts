import { Flags } from "@oclif/core";
import { Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Create a new repository. Requires an existing project in which this repository will be created. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash projects:repos:create -a MyStashAlias --project "ProjectKey" --name "MyRepo" --csv`,
        `$ stash projects:repos:create -a MyStashAlias --project "ProjectKey" --name "MyRepo" --json`,
        `$ stash projects:repos:create -a MyStashAlias --project "ProjectKey" --name "MyRepo" --scm git`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to create the repository',
            required: true,
            name: 'Project'
        }),
        name: Flags.string({
            description: 'The Repository name to create',
            required: true,
            name: 'Project'
        }),
        scm: Flags.string({
            description: 'The Repository SCM Id.',
            required: false,
            name: 'ScmId',
            default: 'git'
        }),
    };
    async run(): Promise<StashCLIResponse<Repository>> {
        const response = new StashCLIResponse<Repository>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).create({
                name: this.flags.name,
                scmId: this.flags.scmId,
            })
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Repository');
            console.log(response.message);
            this.ux.table<Repository>([result], RepositoryColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}