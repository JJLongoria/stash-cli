import { Flags } from "@oclif/core";
import { HookOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { HookColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve a repository hook for this repositories. ' + UX.processDocumentation('<doc:HookOutput>');
    static examples = [
        `$ stash projects:repos:settings:hooks:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --hook "TheHook" --csv`,
        `$ stash projects:repos:settings:hooks:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --hook "TheHook" --json`,
        `$ stash projects:repos:settings:hooks:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --hook "TheHook"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve hook',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve hook',
            required: true,
            name: 'Slug'
        }),
        hook: Flags.string({
            description: 'The Hook id to retrieve.',
            required: true,
            name: 'Hook'
        }),
    };
    async run(): Promise<StashCLIResponse<HookOutput>> {
        const response = new StashCLIResponse<HookOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).settings(this.flags.slug).hooks().get(this.flags.hook);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Hook');
            this.ux.log(response.message);
            this.ux.table<HookOutput>([result], HookColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}