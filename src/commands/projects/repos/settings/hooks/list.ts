import { Flags } from "@oclif/core";
import { HookOutput, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { HookColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of repository hooks for this repository. ' + UX.processDocumentation('<doc:HookOutput>');
    static examples = [
        `$ stash projects:repos:settings:hooks:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:settings:hooks:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --type PRE_RECEIVE -l 100 -s 50 --json`,
        `$ stash projects:repos:settings:hooks:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --type POST_RECEIVE --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve hooks',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve hooks',
            required: true,
            name: 'Slug'
        }),
        type: Flags.string({
            description: 'The optional type to filter by.',
            required: false,
            options: ['PRE_RECEIVE', 'POST_RECEIVE'],
            type: "option",
            name: 'Type'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<HookOutput>>> {
        const response = new StashCLIResponse<Page<HookOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<HookOutput> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).settings(this.flags.slug).hooks().list(this.flags.type, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).settings(this.flags.slug).hooks().list(this.flags.type, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).settings(this.flags.slug).hooks().list(this.flags.type, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Hook');
            this.ux.log(response.message);
            this.ux.table<HookOutput>(result.values, HookColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}