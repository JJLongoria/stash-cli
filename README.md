[**Stash CLI Application**]()
=================

[![Version](https://img.shields.io/npm/v/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash)
[![Total Downloads](https://img.shields.io/npm/dt/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash/core)
[![Downloads/Month](https://img.shields.io/npm/dm/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash)
[![Issues](https://img.shields.io/github/issues/jjlongoria/cli-stash)](https://github.com/JJLongoria/cli-stash/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/cli-stash/badge.svg)](https://snyk.io/test/github/JJLongoria/cli-stash)
[![Code Size](https://img.shields.io/github/languages/code-size/jjlongoria/cli-stash)](https://github.com/JJLongoria/cli-stash)
[![License](https://img.shields.io/github/license/jjlongoria/cli-stash?logo=github)](https://github.com/JJLongoria/cli-stash/blob/master/LICENSE)

CLI application to manage and work with Atlassian Stash. Work with your Stash project and repositories from Command lines.


This CLI Application use the [**Stash Connector**](https://github.com/JJLongoria/stash-connector) library to work with stash. 

- [**Stash CLI Application**](#stash-cli-application)
- [**Usage**](#usage)
- [**Core CLI Commands**](#core-cli-commands)
  - [**`stash help [COMMAND]`**](#stash-help-command)
  - [**`stash update`**](#stash-update)
  - [**`stash commands`**](#stash-commands)
  - [**`stash plugins`**](#stash-plugins)
  - [**`stash plugins:install PLUGIN...`**](#stash-pluginsinstall-plugin)
  - [**`stash plugins:inspect PLUGIN...`**](#stash-pluginsinspect-plugin)
  - [**`stash plugins:install PLUGIN...`**](#stash-pluginsinstall-plugin-1)
  - [**`stash plugins:link PLUGIN`**](#stash-pluginslink-plugin)
  - [**`stash plugins:uninstall PLUGIN...`**](#stash-pluginsuninstall-plugin)
  - [**`stash plugins:uninstall PLUGIN...`**](#stash-pluginsuninstall-plugin-1)
  - [**`stash plugins:uninstall PLUGIN...`**](#stash-pluginsuninstall-plugin-2)
  - [**`stash plugins update`**](#stash-plugins-update)
- [**JSON Objects Schemes**](#json-objects-schemes)
  - [**AddGroupInput**](#addgroupinput)
  - [**AddUsersInput**](#addusersinput)
  - [**Avatar**](#avatar)
  - [**Branch**](#branch)
  - [**ClusterOutput**](#clusteroutput)
  - [**ClusterNode**](#clusternode)
  - [**ClusterAddress**](#clusteraddress)
  - [**CreateUserInput**](#createuserinput)
  - [**FilePath**](#filepath)
  - [**ForkRepoInput**](#forkrepoinput)
  - [**Group**](#group)
  - [**Instance**](#instance)
  - [**License**](#license)
  - [**LicenseStatus**](#licensestatus)
  - [**Line**](#line)
  - [**Link**](#link)
  - [**LinkRef**](#linkref)
  - [**MailHostConfiguration**](#mailhostconfiguration)
  - [**Participant**](#participant)
  - [**ParticipantInput**](#participantinput)
  - [**PermissionGroups**](#permissiongroups)
  - [**PermissionUsersOutput**](#permissionusersoutput)
  - [**Project**](#project)
  - [**ProjectInput**](#projectinput)
  - [**PullRequest**](#pullrequest)
  - [**PullRequestRef**](#pullrequestref)
  - [**PullRequestRefInput**](#pullrequestrefinput)
  - [**PullRequestVeto**](#pullrequestveto)
  - [**Repository**](#repository)
  - [**RepoChangesOutput**](#repochangesoutput)
  - [**UpdateRepoInput**](#updaterepoinput)
  - [**User**](#user)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# [**Usage**]()
<!-- usage -->
```sh-session
$ npm install -g cli-stash
$ stash COMMAND
running command...
$ stash (--version)
cli-stash/0.1.0 win32-x64 node-v16.10.0
$ stash --help [COMMAND]
USAGE
  $ stash COMMAND
...
```
# [**Core CLI Commands**]()
<!-- commands -->


## **`stash help [COMMAND]`**

Display help for Stash CLI.

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

## **`stash update`**

Update the Stash CLI.

```
USAGE
  $ stash update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  Update the Stash CLI

EXAMPLES
  Update to the stable channel:

    $ stash update stable

  Update to a specific version:

    $ stash update --version 1.0.0

  Interactively select version:

    $ stash update --interactive

  See available versions:

    $ stash update --available
```

## **`stash commands`**

List all the commands

```
USAGE
  $ stash commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all the commands
```

## **`stash plugins`**

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


## **`stash plugins:install PLUGIN...`**

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

  e.g. If you have a core plugin that has a "hello" command, installing a user-installed plugin with a "hello" command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ stash plugins add

EXAMPLES
  $ stash plugins:install myplugin 

  $ stash plugins:install https://github.com/someuser/someplugin

  $ stash plugins:install someuser/someplugin
```

## **`stash plugins:inspect PLUGIN...`**

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

## **`stash plugins:install PLUGIN...`**

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

  e.g. If you have a core plugin that has a "hello" command, installing a user-installed plugin with a "hello" command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ stash plugins add

EXAMPLES
  $ stash plugins:install myplugin 

  $ stash plugins:install https://github.com/someuser/someplugin

  $ stash plugins:install someuser/someplugin
```

## **`stash plugins:link PLUGIN`**

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

  e.g. If you have a user-installed or core plugin that has a "hello" command, installing a linked plugin with a "hello"
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ stash plugins:link myplugin
```

## **`stash plugins:uninstall PLUGIN...`**

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

## **`stash plugins:uninstall PLUGIN...`**

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

## **`stash plugins:uninstall PLUGIN...`**

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

## **`stash plugins update`**

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

# [**JSON Objects Schemes**]()

All JSON Schemes used by the Stash CLI application as response or data input are listed bellow.

**Schema definition**:
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
## [**Avatar**]()
```json
{
    "type": "string",
    "content": "string",
}
```
---
## [**Branch**]()
```json
{
    "id": "string",
    "displayId": "string",
    "latestChangeset": "string",
    "latestCommit": "string",
    "isDefault": "boolean",
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
## [**FilePath**]()
```json
{
    "components": "string[]",
    "parent": "string",
    "name": "string",
    "extension": "string",
    "toString": "string",
}
```
---
## [**ForkRepoInput**]()
```json
{
    "slug?": "string",
    "name?": "string",
    "project?": {
        "key": "string",
    },
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
## [**License**]()
```json
{
    "creationDate": "number",
    "purchaseDate": "number",
    "expiryDate": "number",
    "numberOfDaysBeforeExpiry": "number",
    "maintenanceExpiryDate": "number",
    "numberOfDaysBeforeMaintenanceExpiry": "number",
    "gracePeriodEndDate": "number",
    "numberOfDaysBeforeGracePeriodExpiry": "number",
    "maximumNumberOfUsers": "number",
    "unlimitedNumberOfUsers": "boolean",
    "serverId": "string",
    "supportEntitlementNumber": "string",
    "license": "string",
    "status": "LicenseStatus",
}
```
- See [`LicenseStatus`](#licensestatus) Definition

---
## [**LicenseStatus**]()
```json
{
    "serverId": "string",
    "currentNumberOfUsers": "number",
}
```
---
## [**Line**]()
```json
{
    "text": "string",
}
```
---
## [**Link**]()
```json
{
    "url": "string",
    "rel": "string",
}
```
---
## [**LinkRef**]()
```json
{
    "href": "string",
}
```
---
## [**MailHostConfiguration**]()
```json
{
    "hostname": "string",
    "port": "number",
    "protocol": "string",
    "use-start-tls": "boolean",
    "require-start-tls": "boolean",
    "username": "string",
    "sender-address": "string",
}
```
---
## [**Participant**]()
```json
{
    "user": "User",
    "role": "'AUTHOR' | 'REVIEWER' | 'PARTICIPANT'",
    "approved": "boolean",
}
```
- See [`User`](#user) Definition

---
## [**ParticipantInput**]()
```json
{
    "user": {
      "name": "string",
    },
}
```
---
## [**PermissionGroups**]()
```json
{
    "group": "User",
    "permission": "'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN'",
}
```
- See [`Group`](#group) Definition

---
## [**PermissionUsersOutput**]()
```json
{
    "user": "User",
    "permission": "'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN'",
}
```
- See [`User`](#user) Definition

---
## [**Project**]()
```json
{
    "key": "string",
    "id": "string",
    "name": "string",
    "description": "string",
    "public": "boolean",
    "type": "string",
    "link": "Link",
    "links": "{ [key: string]: LinkRef[] }",
}
```
- See [`Link`](#link) Definition.
- See [`LinkRef`](#linkref) Definition

---
## [**ProjectInput**]()
```json
{
    "key": "string",
    "name": "string",
    "description": "string",
    "avatarFile": "string",
}
```
---
## [**PullRequest**]()
```json
{
    "id": "number",
    "version": "number",
    "title": "string",
    "description": "string",
    "state": "'ALL' | 'OPEN' | 'DECLINED' | 'MERGED'",
    "open": "boolean",
    "closed": "boolean",
    "canMerge": "boolean",
    "conflicted": "boolean",
    "vetoes": "PullRequestVeto[]",
    "createdDate": "number",
    "updatedDate": "number",
    "fromRef": "PullRequestRef",
    "toRef": "PullRequestRef",
    "locked": "boolean",
    "author": "Participant",
    "reviewers": "Participant[]",
    "participants": "Participant[]",
}
```
- See [`PullRequestVeto`](#pullrequestveto) Definition.
- See [`PullRequestRef`](#pullrequestref) Definition.
- See [`Participant`](#participant) Definition.

---
## [**PullRequestRef**]()
```json
{
    "id": "string",
    "repository": "Repository",
}
```
- See [`Repository`](#repository) Definition.

---
## [**PullRequestRefInput**]()
```json
{
    "id": "string",
    "repository": {
      "slug": "string",
      "project": {
          "key": "string",
      }
    },
}
```
---
## [**PullRequestVeto**]()
```json
{
    "summaryMessage": "string",
    "detailedMessage": "string",
}
```
---
## [**Repository**]()
```json
{
    "slug": "string",
    "id": "string",
    "name": "string",
    "origin?": "Repository",
    "scmId": "string",
    "state": "string",
    "statusMessage": "string",
    "forkable": "boolean",
    "project": "Project",
    "public": "boolean",
    "cloneUr": "string",
    "link": "Link",
    "links": "{ [key: string]: LinkRef[] }",
}
```
- See [`Project`](#project) Definition
- See [`Link`](#link) Definition.
- See [`LinkRef`](#linkref) Definition

---
## [**RepoChangesOutput**]()
```json
{
    "contentId": "string",
    "fromContentId": "string",
    "path": "FilePath",
    "executable": "boolean",
    "percentUnchanged":" number",
    "type": "string",
    "nodeType": "string",
    "srcPath": "FilePath",
    "srcExecutable": "boolean",
}
```
- See [`FilePath`](#filepath) Definition

---
## [**UpdateRepoInput**]()
```json
{
    "slug?": "string",
    "name?": "string",
    "scmId?": "string",
    "forkable?": "boolean",
    "project?": {
        "key": "string",
    },
    "public?": "boolean",
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


