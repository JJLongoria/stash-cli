import { CliUx } from "@oclif/core";
import * as notifier from 'node-notifier';

export class UX {
    startSpinner(message: string) {
        CliUx.ux.action.start(message);
    }

    stopSpinner(message?: string) {
        CliUx.ux.action.stop(message);
    }

    table<T>(data: any[], columns: CliUx.Table.table.Columns<Record<string, T>>, options: CliUx.Table.table.Options = {}) {
        CliUx.ux.table(data, columns, options);
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
}