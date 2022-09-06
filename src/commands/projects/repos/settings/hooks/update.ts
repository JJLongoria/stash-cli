import { Flags } from "@oclif/core";
import { HookOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { HookColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Modify the settings for a repository hook for this repositories. ' + UX.processDocumentation('<doc:HookOutput>');
    static examples = [
        `$ stash projects:repos:settings:hooks:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --hook "TheHook" --data "{'details':{'key':'hookKey','name':'HookName','type':'PRE_RECEIVE','description':'Description.','version':'1.0.0','configFormKey':null},'enabled':true,'configured':true}" --csv`,
        `$ stash projects:repos:settings:hooks:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --hook "TheHook" --file "Path/to/data/json/file" --json`,
        `$ stash projects:repos:settings:hooks:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --hook "TheHook" --file "Path/to/data/json/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:HookInput>', false),
        file: BuildFlags.input.jsonFile('<doc:HookInput>', false),
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to update hook',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to update hook',
            required: true,
            name: 'Slug'
        }),
        hook: Flags.string({
            description: 'The Hook id to update.',
            required: true,
            name: 'Hook'
        }),
    };
    async run(): Promise<StashCLIResponse<HookOutput>> {
        const response = new StashCLIResponse<HookOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).settings(this.flags.slug).hooks().settings(this.flags.hook).update(this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Hook');
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