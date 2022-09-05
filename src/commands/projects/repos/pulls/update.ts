import { Flags } from "@oclif/core";
import { PullRequest, PullRequestUpdateInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PullRequestColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Update the title, description, reviewers or destination branch of an existing pull request. ' + UX.processDocumentation('<doc:PullRequest>');
    static examples = [
        `$ stash projects:repos:pulls:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --data "{'title':'<Title>','description':'<description>','toRef':{'id':'refs/heads/master','repository':{'slug':'MyRepoSlug','name':null,'project':{'key':'ProjectKey'}}},'reviewers':[{'user':{'name':'jonh.smith'}}]}" --json`,
        `$ stash projects:repos:pulls:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --file "path/to/json/data/file" --csv`,
        `$ stash projects:repos:pulls:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --title "Title" --description "desc" --from "develop" --to "main" --reviewers "john.smith, jenny.smith"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:PullRequestInput>', false, ['from', 'title', 'description', 'reviewers']),
        file: BuildFlags.input.jsonFile('<doc:PullRequestInput>', false, ['from', 'title', 'description', 'reviewers']),
        project: Flags.string({
            description: 'The Project key to update the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to update the pull request',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to update',
            required: true,
            name: 'Pull Request Id',
        }),
        title: Flags.string({
            description: 'The Pull Request Title',
            required: false,
            name: 'Title',
            exclusive: ['data', 'file'],
        }),
        description: Flags.string({
            description: 'The Pull Request Description',
            required: false,
            name: 'Description',
            exclusive: ['data', 'file'],
        }),
        target: Flags.string({
            description: 'The target (to ref) branch to create the pull request',
            required: false,
            name: 'Target',
            exclusive: ['data', 'file'],
        }),
        reviewers: Flags.string({
            description: 'Comma separated pull requests reviewers names',
            required: false,
            name: 'Target',
            exclusive: ['data', 'file'],
            parse: (input): any => {
                return BuildFlags.parseArray(input);
            }
        }),
    };
    async run(): Promise<StashCLIResponse<PullRequest>> {
        const response = new StashCLIResponse<PullRequest>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let inputData: PullRequestUpdateInput;
            if (this.hasInputData()) {
                inputData = this.getInputData() as PullRequestUpdateInput;
            } else {
                inputData = {
                    description: this.flags.description,
                    title: this.flags.title,
                    toRef: {
                        id: '',
                        repository: {
                            slug: this.flags.slug,
                            project: {
                                key: this.flags.project
                            }
                        }
                    },
                    reviewers: this.flags.reviewers,
                }
                const targetBranchResult = await connector.projects.repos(this.flags.project).branches(this.flags.slug).list({
                    filterText: this.flags.target,
                });
                if (targetBranchResult.values.length === 0) {
                    throw new Error('From branch not found (' + this.flags.from + ')');
                }
                if (targetBranchResult.values.length > 1) {
                    throw new Error('Found more than one branch as target with name (' + this.flags.target + ')');
                }
                const targetBranch = targetBranchResult.values[0];
                if(inputData.toRef){
                    inputData.toRef.id = targetBranch.id;
                }
            }
            const pullRequest = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).update(this. flags.pull, inputData);
            response.result = pullRequest;
            response.status = 0;
            response.message = this.getRecordCreatedText('Pull Request');
            this.ux.log(response.message);
            this.ux.table<PullRequest>([pullRequest], PullRequestColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}