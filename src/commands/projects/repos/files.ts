import { Flags } from "@oclif/core";
import { Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Files extends BaseCommand {
    static description = 'Retrieve a page of files from particular directory of a repository. The search is done recursively, so all files from any sub-directory of the specified directory will be returned.';
    static examples = [
        `$ stash projects:repos:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --until "as48llmdf" --context-lines 5 --csv`,
        `$ stash projects:repos:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --until "as48llmdf" --src "path/to/src/path" --'without-comments' --json`,
        `$ stash projects:repos:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --until "as48llmdf" --path "path/to/file" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to get files',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to get files',
            required: true,
            name: 'Slug'
        }),
        at: Flags.string({
            description: 'The changeset id or ref (e.g. a branch or tag) to list the files at. If not specified the default branch will be used instead.',
            required: false,
            name: 'From'
        }),
        path: Flags.string({
            description: 'The directory to list files for.',
            required: false,
            name: 'Path',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<string>>> {
        const response = new StashCLIResponse<Page<string>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<string> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).files(this.flags.slug).list({
                    at: this.flags.at,
                    pageOptions: this.allPageOptions,
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).files(this.flags.slug).list({
                        at: this.flags.at,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).files(this.flags.slug).list({
                    at: this.flags.at,
                    pageOptions: this.pageOptions,
                });
            }
            response.result = result;
            response.status = 0;
            response.message = result.values.length + ' files retrieved';
            this.ux.log(response.message);
            this.ux.table<string>(result.values, {
                file: {
                    header: 'File'
                }
            }, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}