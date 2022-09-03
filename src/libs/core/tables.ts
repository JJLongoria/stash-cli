import { CliUx } from "@oclif/core";
import { ClusterNode, Group } from "stash-connector";
import { Instance } from "./config";

export const InstanceColumns: CliUx.Table.table.Columns<Record<string, Instance>> = {
    alias: {
        header: 'Alias',
        minWidth: 10
    },
    host: {
        header: 'Host URL',
        minWidth: 20,
    },
    token: {
        header: 'Token',
        minWidth: 20,
    }
};

export const GroupColumns: CliUx.Table.table.Columns<Record<string, Group>> = {
    name: {
        header: 'Name',
    },
    deletable: {
        header: 'Deletable',
    },
};

export const ClusterNodeColumns: CliUx.Table.table.Columns<Record<string, ClusterNode>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    address: {
        header: 'Address',
        get: (row) => { return row.hostName + ':' + row.port }
    },
    local: {
        header: 'Local',
    },
}