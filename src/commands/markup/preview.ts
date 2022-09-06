import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { FileChecker, FileWriter, PathUtils } from "../../libs/fileSystem";

export default class Download extends BaseCommand {
    static description = 'Preview the generated html for given markdown contents';
    static examples = [
        `$ stash markup:prewiew -a MyStashAlias --data "#My Markdown Content to preview"`,
        `$ stash markup:prewiew -a MyStashAlias --file "path/to/markdown/file"`,
        `$ stash markup:prewiew -a MyStashAlias --data "#My Markdown Content to preview" --output-file "path/to/the/output/file.html" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.data('', false),
        file: BuildFlags.input.file('', false),
        mode: Flags.string({
            description: 'The URL Mode.',
            required: false,
            name: 'Mode'
        }),
        hardwrap: Flags.boolean({
            description: 'Hardwrap.',
            required: false,
            name: 'Hardwrap'
        }),
        escape: Flags.string({
            description: 'Escape HTML.',
            required: false,
            name: 'HTML Escape'
        }),
        'output-file': BuildFlags.output.file('', false),
    };
    async run(): Promise<StashCLIResponse<any> | any> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const markupPreview = await connector.markup.preview(this.getInputData(), {
                hardwrap: this.flags.hardwrap,
                htmlEscape: this.flags.escape,
                urlMode: this.flags.mode,
            });
            response.result = markupPreview.html;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Markup Preview');
            if(!this.flags['output-file']){
                this.ux.log(markupPreview.html);
            } else {
                const absolutePath = PathUtils.getAbsolutePath(this.flags['output-file']);
                const basePath = PathUtils.getDirname(absolutePath);
                if(!FileChecker.isExists(basePath)){
                    FileWriter.createFolderSync(basePath);
                }
                FileWriter.createFileSync(absolutePath, markupPreview.html);
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}