import { CliUx } from "@oclif/core";
import { ClusterNode, Group, User } from "stash-connector";
import { Instance } from "../types";

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

export const UserColumns: CliUx.Table.table.Columns<Record<string, User>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    slut: {
        header: 'User Slug',
    },
    displayName: {
        header: 'Display Name',
    },
    emailAddress: {
        header: 'Email',
    },
    active: {
        header: 'Active',
        extended: true,
    },
    type: {
        header: 'Type',
        extended: true,
    },
    directoryName: {
        header: 'Directory Name',
        extended: true,
    },
    deletable: {
        header: 'Deletable',
        extended: true,
    },
    lastAuthenticationTimestamp: {
        header: 'Last Autentication',
        extended: true,
        get: (row: any) => {
            return new Date(row.lastAuthenticationTimestamp).toISOString();
        }
    },
    mutableDetails: {
        header: 'Mutable Details',
        extended: true,
    },
    mutableGroups: {
        header: 'Mutable Groups',
        extended: true,
    },
}