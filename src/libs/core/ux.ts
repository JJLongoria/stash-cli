import { CliUx } from "@oclif/core";
import { OutputFlags } from "@oclif/core/lib/interfaces";
import * as notifier from 'node-notifier';
import { StrUtils } from "../utils/strUtils";

export class UX {

    flags: OutputFlags<any>;

    constructor(flags?: OutputFlags<any>) {
        this.flags = flags || {};
    }

    startSpinner(message: string) {
        CliUx.ux.action.start(message);
    }

    stopSpinner(message?: string) {
        CliUx.ux.action.stop(message);
    }

    log(message: string) {
        if (!this.flags.json) {
            console.log(message);
        }
    }

    table<T>(data: any[], columns: CliUx.Table.table.Columns<Record<string, T>>, options: CliUx.Table.table.Options = {}) {
        if (!this.flags.json) {
            CliUx.ux.table(data, columns, options);
        }
    }

    prompt(text: string, options?: CliUx.IPromptOptions) {
        return CliUx.ux.prompt(text, options);
    }

    notify(title: string, message?: string) {
        notifier.notify({
            title: title,
            message: message
        });
    }

    static processDocumentation(desc?: string): string | undefined {
        const readmeURL = 'https://github.com/JJLongoria/stash-cli/blob/main/README.md';
        if (desc) {
            if (StrUtils.containsIgnorecase(desc, '<doc:')) {
                const docData = desc.substring(desc.indexOf('<doc:'), desc.indexOf('>') + 1);
                let doctype = StrUtils.replace(docData, '<doc:', '');
                doctype = StrUtils.replace(doctype, '>', '');
                const message = 'See the JSON Schema on: ' + readmeURL + '#' + doctype.toLowerCase();
                desc = StrUtils.replace(desc, docData, message);
            }
            return desc;
        }
        return undefined;
    }

    static cannotUseWith(flags: string[]) {
        let convertedFlags = [];
        for (const flag of flags) {
            convertedFlags.push('--' + flag);
        }
        return 'Cannot use with ' + convertedFlags.join(', ') + ' flag' + (flags.length > 1 ? 's' : '');
    }

    static dependsOn(flags: string[]) {
        let convertedFlags = [];
        for (const flag of flags) {
            convertedFlags.push('--' + flag);
        }
        return 'Depends on ' + convertedFlags.join(', ') + ' flag' + (flags.length > 1 ? 's' : '');
    }
}