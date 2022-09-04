oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g stash-cli
$ stash COMMAND
running command...
$ stash (--version)
stash-cli/0.0.0 win32-x64 node-v16.10.0
$ stash --help [COMMAND]
USAGE
  $ stash COMMAND
...
```
# Commands
<!-- commands -->
- [oclif-hello-world](#oclif-hello-world)
- [Usage](#usage)
- [Commands](#commands)
  - [`stash hello PERSON`](#stash-hello-person)
  - [`stash hello world`](#stash-hello-world)
  - [`stash help [COMMAND]`](#stash-help-command)
  - [`stash plugins`](#stash-plugins)
  - [`stash plugins:install PLUGIN...`](#stash-pluginsinstall-plugin)
  - [`stash plugins:inspect PLUGIN...`](#stash-pluginsinspect-plugin)
  - [`stash plugins:install PLUGIN...`](#stash-pluginsinstall-plugin-1)
  - [`stash plugins:link PLUGIN`](#stash-pluginslink-plugin)
  - [`stash plugins:uninstall PLUGIN...`](#stash-pluginsuninstall-plugin)
  - [`stash plugins:uninstall PLUGIN...`](#stash-pluginsuninstall-plugin-1)
  - [`stash plugins:uninstall PLUGIN...`](#stash-pluginsuninstall-plugin-2)
  - [`stash plugins update`](#stash-plugins-update)
  - [`oex hello PERSON`](#oex-hello-person)
  - [`oex hello world`](#oex-hello-world)
  - [`oex help [COMMAND]`](#oex-help-command)
  - [`oex plugins`](#oex-plugins)
  - [`oex plugins:inspect PLUGIN...`](#oex-pluginsinspect-plugin)
  - [`oex plugins:install PLUGIN...`](#oex-pluginsinstall-plugin)
  - [`oex plugins:link PLUGIN`](#oex-pluginslink-plugin)
  - [`oex plugins:uninstall PLUGIN...`](#oex-pluginsuninstall-plugin)
  - [`oex plugins update`](#oex-plugins-update)
- [**JSON Objects Schemes**](#json-objects-schemes)
  - [**AddGroupInput**](#addgroupinput)
  - [**AddUsersInput**](#addusersinput)
  - [**ClusterOutput**](#clusteroutput)
  - [**ClusterNode**](#clusternode)
  - [- See `ClusterAddress` Definition](#--see-clusteraddress-definition)
  - [**ClusterAddress**](#clusteraddress)
  - [**CreateUserInput**](#createuserinput)
  - [**Group**](#group)
  - [**Instance**](#instance)
  - [**User**](#user)

## `stash hello PERSON`

Say hello

```
USAGE
  $ stash hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/JJLongoria/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `stash hello world`

Say hello world

```
USAGE
  $ stash hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `stash help [COMMAND]`

Display help for stash.

```
USAGE
  $ stash help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for stash.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `stash plugins`

List installed plugins.

```
USAGE
  $ stash plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ stash plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `stash plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ stash plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ stash plugins add

EXAMPLES
  $ stash plugins:install myplugin 

  $ stash plugins:install https://github.com/someuser/someplugin

  $ stash plugins:install someuser/someplugin
```

## `stash plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ stash plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ stash plugins:inspect myplugin
```

## `stash plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ stash plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ stash plugins add

EXAMPLES
  $ stash plugins:install myplugin 

  $ stash plugins:install https://github.com/someuser/someplugin

  $ stash plugins:install someuser/someplugin
```

## `stash plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ stash plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ stash plugins:link myplugin
```

## `stash plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ stash plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ stash plugins unlink
  $ stash plugins remove
```

## `stash plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ stash plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ stash plugins unlink
  $ stash plugins remove
```

## `stash plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ stash plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ stash plugins unlink
  $ stash plugins remove
```

## `stash plugins update`

Update installed plugins.

```
USAGE
  $ stash plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
- [oclif-hello-world](#oclif-hello-world)
- [Usage](#usage)
- [Commands](#commands)
  - [`stash hello PERSON`](#stash-hello-person)
  - [`stash hello world`](#stash-hello-world)
  - [`stash help [COMMAND]`](#stash-help-command)
  - [`stash plugins`](#stash-plugins)
  - [`stash plugins:install PLUGIN...`](#stash-pluginsinstall-plugin)
  - [`stash plugins:inspect PLUGIN...`](#stash-pluginsinspect-plugin)
  - [`stash plugins:install PLUGIN...`](#stash-pluginsinstall-plugin-1)
  - [`stash plugins:link PLUGIN`](#stash-pluginslink-plugin)
  - [`stash plugins:uninstall PLUGIN...`](#stash-pluginsuninstall-plugin)
  - [`stash plugins:uninstall PLUGIN...`](#stash-pluginsuninstall-plugin-1)
  - [`stash plugins:uninstall PLUGIN...`](#stash-pluginsuninstall-plugin-2)
  - [`stash plugins update`](#stash-plugins-update)
  - [`oex hello PERSON`](#oex-hello-person)
  - [`oex hello world`](#oex-hello-world)
  - [`oex help [COMMAND]`](#oex-help-command)
  - [`oex plugins`](#oex-plugins)
  - [`oex plugins:inspect PLUGIN...`](#oex-pluginsinspect-plugin)
  - [`oex plugins:install PLUGIN...`](#oex-pluginsinstall-plugin)
  - [`oex plugins:link PLUGIN`](#oex-pluginslink-plugin)
  - [`oex plugins:uninstall PLUGIN...`](#oex-pluginsuninstall-plugin)
  - [`oex plugins update`](#oex-plugins-update)
- [**JSON Objects Schemes**](#json-objects-schemes)
  - [**AddGroupInput**](#addgroupinput)
  - [**AddUsersInput**](#addusersinput)
  - [**ClusterOutput**](#clusteroutput)
  - [**ClusterNode**](#clusternode)
  - [- See `ClusterAddress` Definition](#--see-clusteraddress-definition)
  - [**ClusterAddress**](#clusteraddress)
  - [**CreateUserInput**](#createuserinput)
  - [**Group**](#group)
  - [**Instance**](#instance)
  - [**User**](#user)

## `oex hello PERSON`

Say hello

```
USAGE
  $ oex hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/oclif/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `oex hello world`

Say hello world

```
USAGE
  $ oex hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `oex help [COMMAND]`

Display help for oex.

```
USAGE
  $ oex help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for oex.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `oex plugins`

List installed plugins.

```
USAGE
  $ oex plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ oex plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `oex plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ oex plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ oex plugins:inspect myplugin
```

## `oex plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oex plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ oex plugins add

EXAMPLES
  $ oex plugins:install myplugin 

  $ oex plugins:install https://github.com/someuser/someplugin

  $ oex plugins:install someuser/someplugin
```

## `oex plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ oex plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ oex plugins:link myplugin
```

## `oex plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oex plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oex plugins unlink
  $ oex plugins remove
```

## `oex plugins update`

Update installed plugins.

```
USAGE
  $ oex plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

# [**JSON Objects Schemes**]()

All JSON Schemes used by the Stash CLI application as response or data input.

Schema definition:
```json
{
  "FieldName": "FieldType", // Required field
  "FieldName?": "FieldType", // Optional field
}
```
---
## [**AddGroupInput**]()
```json
{
    "user": "string",
    "groups": "string[]",
}
```
---
## [**AddUsersInput**]()
```json
{
    "group": "string",
    "users": "string[]",
}
```
---
## [**ClusterOutput**]()
```json
{
    "localNode": "ClusterNode",
    "nodes": "ClusterNode[]",
    "running": "boolean",
}
```
- See [`ClusterNode`](#clusternode) Definition

---
## [**ClusterNode**]()

```json
{
    "id": "string",
    "name": "string",
    "address": "ClusterAddress",
    "local": "boolean",
}
```
- See [`ClusterAddress`](#clusteraddress) Definition
---
## [**ClusterAddress**]()
```json
{
    "hostName": "string",
    "port": "number",
}
```
---
## [**CreateUserInput**]()
```json
{
    "name": "string",
    "password": "string",
    "displayName": "string",
    "emailAddress": "string",
    "addToDefaultGroup": "boolean",
    "notify": "string",
}
```
---
## [**Group**]()
```json
{
    "name": "string",
    "deletable": "boolean",
}
```
---
## [**Instance**]()
```json
{
    "alias": "string",
    "host": "string",
    "token": "string",
}
```
---
## [**User**]()
```json
{
    "name": "string",
    "emailAddress": "string",
    "id": "number",
    "displayName": "string",
    "active": "boolean",
    "slug": "string",
    "type": "string",
    "directoryName?": "string",
    "deletable?": "boolean",
    "lastAuthenticationTimestamp?": "number",
    "mutableDetails?": "boolean",
    "mutableGroups?": "boolean",
}
```
---
