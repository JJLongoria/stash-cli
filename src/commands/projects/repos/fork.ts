import { Flags } from "@oclif/core";
import { Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Fork extends BaseCommand {
    static description = 'Create a new repository forked from an existing repository. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash projects:repos:fork -a MyStashAlias --project "OriginProject" --slug "OriginRepoSlug" --csv`,
        `$ stash projects:repos:fork -a MyStashAlias --project "OriginProject" --slug "OriginRepoSlug" --target-slug "TargetSlug" --json`,
        `$ stash projects:repos:fork -a MyStashAlias --project "OriginProject" --slug "OriginRepoSlug" --target-slug "TargetSlug" --target-project "TargetProject" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Origin Project key to fork the repository',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Origin repository slug.',
            required: true,
            name: 'Slug'
        }),
        'target-name': Flags.string({
            description: 'The Forked repository name. Defaults to the name of the origin repository if not specified',
            required: false,
            name: 'Target Slug'
        }),
        'target-project': Flags.string({
            description: 'The Target Project key to fork the repository. Defaults to the current user\'s personal project if not specified',
            required: false,
            name: 'Target Project'
        }),
    };
    async run(): Promise<StashCLIResponse<Repository>> {
        const response = new StashCLIResponse<Repository>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).fork(this.flags.slug, {
                name: this.flags['target-name'],
                project: this.flags['target-project'] ? { key: this.flags['target-project'] } : undefined,
            });
            response.result = result;
            response.status = 0;
            response.message = 'The Repository forked successfully';
            this.ux.log(response.message);
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