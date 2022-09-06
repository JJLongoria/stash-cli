import { Flags } from "@oclif/core";
import { Participant, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { ParticipantColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Approve extends BaseCommand {
    static description = 'Approve a pull request as the current user. Implicitly adds the user as a participant if they are not already. ' + UX.processDocumentation('<doc:Participant>');
    static examples = [
        `$ stash projects:repos:pulls:unapprove -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --csv`,
        `$ stash projects:repos:pulls:unapprove -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --json`,
        `$ stash projects:repos:pulls:unapprove -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to unapprove the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to unapprove the pull request',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to unapprove',
            required: true,
            name: 'Pull Request Id',
        }),
    };
    async run(): Promise<StashCLIResponse<Participant>> {
        const response = new StashCLIResponse<Participant>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const participant = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).approval(this.flags.pull).delete();
            response.status = 0;
            response.message = 'Pull Request Unapproved successfully';
            this.ux.log(response.message);
            this.ux.table<Participant>([participant], ParticipantColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}