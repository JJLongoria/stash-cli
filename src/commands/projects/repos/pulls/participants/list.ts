import { Flags } from "@oclif/core";
import { Page, Participant, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { ParticipantColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieves a page of the participants for a given pull request. ' + UX.processDocumentation('<doc:Participant>');
    static examples = [
        `$ stash projects:repos:pulls:participants:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --all --csv`,
        `$ stash projects:repos:pulls:participants:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 -l 100 -s 50 --json`,
        `$ stash projects:repos:pulls:participants:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve repository pull requests participants',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull requests participants',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to retrieve participants',
            required: true,
            name: 'Pull Request Id',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Participant>>> {
        const response = new StashCLIResponse<Page<Participant>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Participant> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).participants(this.flags.pull).list(this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).participants(this.flags.pull).list({
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).participants(this.flags.pull).list(this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Participant');
            this.ux.log(response.message);
            this.ux.table<Participant>(result.values, ParticipantColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}