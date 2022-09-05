import { Flags } from "@oclif/core";
import { Comment, CommentInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommentColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Add a new comment. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --data "{'text':'The comment text.'}" --csv`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --data "{'text':'A Comment Reply.','parent':{'id':1}}" --json`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --data "{'text':'A General file comment','anchor':{'path':'path/to/file','srcPath':'path/to/file'}}" --json`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --data "{'text':'A comment on file line.','anchor':{'line': 1, 'lineType': 'CONTEXT', 'fileType': 'FROM', 'path':'path/to/file','srcPath':'path/to/file'}}" --json`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --file "path/to/json/data/file" --csv`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --text "The comment text" --json`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --text "A comment Reply" --parent 1`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --text "A General file comment" --path "path/to/file"`,
        `$ stash projects:repos:commits:comments:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --text "A comment on file line" --path "path/to/file" --line 1`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:CommentInput>', false, ['text']),
        file: BuildFlags.input.jsonFile('<doc:CommentInput>', false, ['text']),
        project: Flags.string({
            description: 'The Project key to create the commit comment',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to create the commit comment',
            required: true,
            name: 'Slug',
        }),
        commit: Flags.string({
            description: 'The commit Id to create the comment',
            required: false,
            name: 'Commit Id',
        }),
        text: Flags.string({
            description: 'The Comment text to add',
            required: false,
            name: 'Text',
            exclusive: ['data', 'file']
        }),
        parent: Flags.string({
            description: 'The parent comment if the comment is a response',
            required: false,
            name: 'Parent Comment',
            dependsOn: ['text'],
        }),
        path: Flags.string({
            description: 'The file path if the comment is a general file comment',
            required: false,
            name: 'File Path',
            dependsOn: ['text'],
        }),
        line: Flags.integer({
            description: 'The file line if the comment is a file line comment',
            required: false,
            name: 'Line',
            dependsOn: ['text', 'path'],
        }),
    };
    async run(): Promise<StashCLIResponse<Comment>> {
        const response = new StashCLIResponse<Comment>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let inputData: CommentInput;
            if (this.hasInputData()) {
                inputData = this.getJSONInputData();
            } else {
                inputData = {
                    text: this.flags.text,
                };
                if (this.flags.parent) {
                    inputData.parent = this.flags.parent;
                }
                if (this.flags.path) {
                    inputData.anchor = {
                        path: this.flags.path,
                        srcPath: this.flags.path,
                    };
                    if (this.flags.line >= 0) {
                        inputData.anchor.lineType = "CONTEXT";
                        inputData.anchor.fileType = "FROM";
                        inputData.anchor.line = this.flags.line;
                    }
                }
            }
            const comment = await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.commit).create(inputData);
            response.result = comment;
            response.status = 0;
            response.message = this.getRecordCreatedText('Comment');
            this.ux.log(response.message);
            this.ux.table<Comment>([comment], CommentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}