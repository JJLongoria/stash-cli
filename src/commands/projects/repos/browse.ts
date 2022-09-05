import { Flags } from "@oclif/core";
import { Line, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { LineColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Browse extends BaseCommand {
    static description = 'Retrieve a page of content for a file path at a specified revision. ' + UX.processDocumentation('<doc:Line>');
    static examples = [
        `$ stash projects:repos:browse -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:browse -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --at "<commmitId>" -l 100 -s 50 --json`,
        `$ stash projects:repos:browse -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --type --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to browse into the repository',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to browse',
            required: true,
            name: 'Slug'
        }),
        at: Flags.string({
            description: 'The changeset id or ref to retrieve the content for',
            required: false,
            name: 'At'
        }),
        type: Flags.boolean({
            description: 'If true only the type will be returned for the file path instead of the contents.',
            required: false,
            name: 'Type'
        }),
        blame: Flags.string({
            description: 'If present the blame will be returned for the file as well.',
            required: false,
            name: 'Blame'
        }),
        'no-content': Flags.string({
            description: 'If present and used with blame only the blame is retrieved instead of the contents.',
            required: false,
            name: 'No Content'
        }),
        path: Flags.string({
            description: 'Retrieve a page of content for a file path at a specified revision.',
            required: false,
            name: 'Path'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Line>>> {
        const response = new StashCLIResponse<Page<Line>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Line> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).browse(this.flags.slug).list({
                    at: this.flags.at,
                    type: this.flags.type,
                    blame: this.flags.blame,
                    noContent: this.flags['no-content'],
                    pageOptions: this.allPageOptions
                }, this.flags.path);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).browse(this.flags.slug).list({
                        at: this.flags.at,
                        type: this.flags.type,
                        blame: this.flags.blame,
                        noContent: this.flags['no-content'],
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    }, this.flags.path);
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).browse(this.flags.slug).list({
                    at: this.flags.at,
                    type: this.flags.type,
                    blame: this.flags.blame,
                    noContent: this.flags['no-content'],
                    pageOptions: this.pageOptions
                }, this.flags.path);
            }
            response.result = result;
            response.status = 0;
            response.message = result.values.length + ' Lines found';
            this.ux.log(response.message);
            this.ux.table<Line>(result.values, LineColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}