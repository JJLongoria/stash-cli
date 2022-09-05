import { Flags } from "@oclif/core";
import { Branch, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { BranchColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Get the default branch of the repository. ' + UX.processDocumentation('<doc:Branch>');
    static examples = [
        `$ stash projects:repos:branches:default:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --csv`,
        `$ stash projects:repos:branches:default:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve the default branch',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the default branch',
            required: true,
            name: 'Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<Branch>> {
        const response = new StashCLIResponse<Branch>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).branches(this.flags.slug).default().get();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Branch');
            console.log(response.message);
            this.ux.table<Branch>([result], BranchColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}