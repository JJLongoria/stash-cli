import { Flags } from "@oclif/core";
import { Page, PullRequestActivity, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { PullRequestActivityColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of activity associated with a pull request. ' + UX.processDocumentation('<doc:PullRequestActivity>');
    static examples = [
        `$ stash projects:repos:pulls:activities:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --all --csv`,
        `$ stash projects:repos:pulls:activities:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --type COMMENT -l 100 -s 50 --json`,
        `$ stash projects:repos:pulls:activities:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --from 5678 --type ACTIVITY --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve repository pull requests activities',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull requests activities',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to retrieve activities',
            required: true,
            name: 'Pull Request Id',
        }),
        from: Flags.integer({
            description: 'The id of the activity item to use as the first item in the returned page',
            required: true,
            name: 'From Pull Request Id',
            dependsOn: ['type']
        }),
        type: Flags.string({
            description: 'The type of the activity item specified by fromId',
            required: true,
            options: ['COMMENT', 'ACTIVITY'],
            type: "option",
            name: 'From Type',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<PullRequestActivity>>> {
        const response = new StashCLIResponse<Page<PullRequestActivity>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<PullRequestActivity> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).activities(this.flags.pull).list({
                    fromType: this.flags.type,
                    fromId: this.flags.from,
                    pageOptions: this.allPageOptions,
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).activities(this.flags.pull).list({
                        fromType: this.flags.type,
                        fromId: this.flags.from,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).activities(this.flags.pull).list({
                    fromType: this.flags.type,
                    fromId: this.flags.from,
                    pageOptions: this.pageOptions,
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Pull Request');
            this.ux.log(response.message);
            this.ux.table<PullRequestActivity>(result.values, PullRequestActivityColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}