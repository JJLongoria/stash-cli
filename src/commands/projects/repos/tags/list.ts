import { Flags } from "@oclif/core";
import { Page, StashConnector, TagOutput } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { TagColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve the tags matching the supplied filterText param. ' + UX.processDocumentation('<doc:TagOutput>');
    static examples = [
        `$ stash projects:repos:tags:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:tags:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --filter "textToFilter" -l 100 -s 50 --json`,
        `$ stash projects:repos:tags:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --order MODIFICATION --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
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
        filter: BuildFlags.filter('The text to match on'),
        order: Flags.string({
            description: 'Ordering of refs either ALPHABETICAL (by name) or MODIFICATION (last updated)',
            required: false,
            options: ['ALPHABETICAL', 'MODIFICATION'],
            type: "option",
            name: 'Order By',
        })

    };
    async run(): Promise<StashCLIResponse<Page<TagOutput>>> {
        const response = new StashCLIResponse<Page<TagOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<TagOutput> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).tags(this.flags.slug).list({
                    filterText: this.flags.filter,
                    orderBy: this.flags.order,
                    pageOptions: this.allPageOptions,
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).tags(this.flags.slug).list({
                        filterText: this.flags.filter,
                        orderBy: this.flags.order,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).tags(this.flags.slug).list({
                    filterText: this.flags.filter,
                    orderBy: this.flags.order,
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Tag');
            this.ux.log(response.message);
            this.ux.table<TagOutput>(result.values, TagColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}