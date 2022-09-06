[**Stash CLI Application - BETA -**]()
=================

[![Version](https://img.shields.io/npm/v/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash)
[![Total Downloads](https://img.shields.io/npm/dt/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash/core)
[![Downloads/Month](https://img.shields.io/npm/dm/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash)
[![Issues](https://img.shields.io/github/issues/jjlongoria/stash-cli)](https://github.com/JJLongoria/stash-cli/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/cli-stash/badge.svg)](https://snyk.io/test/github/JJLongoria/cli-stash)
[![Code Size](https://img.shields.io/github/languages/code-size/jjlongoria/stash-cli)](https://github.com/JJLongoria/stash-cli)
[![License](https://img.shields.io/github/license/jjlongoria/stash-cli?logo=github)](https://github.com/JJLongoria/stash-cli/blob/master/LICENSE)

**CLI application** to manage and work with **Atlassian Stash**. Work with your Stash *projects* and *repositories* from Command lines. The benefits of a CLI applications are both, able to the users to **handle Stash repositories outside Stash**, and more important, can **automate** Tasks against Stash like merge pull requests for example. This tool are designed to be really easy to learn and use because group topics and commands with a semantic names.

**Stash CLI** allow to any user to work with **Stash outside Stash** from a command line. Admin Stash with the Administration commands or updated your user details easy from the command line. You can Watch or Unwatch commits and pull request with a simple command, even test to merge or merge the pull request easy. Add comments to a commit or pull request or respond a command. Grant or Revoke app, project or repository permissions in a few steps and every what you want with Stash.

**Automate** every task from the command line easy to make many things automatically. There are many posibilities.

To learn more or read a full documentation of the **Stash CLI Application**, go to the [**Official Documentation Site**](https://github.com/JJLongoria/stash-cli/wiki).

This CLI Application use the [**Stash Connector**](https://github.com/JJLongoria/stash-connector) library to connect and work with stash. 

Supported Operative Systems:
- Windows
- Linux
- Mac OS X

Now Stil in BETA Version because is not fully tested.

--- 

- [**Stash CLI Application - BETA -**](#stash-cli-application---beta--)
- [**Installation Guide**](#installation-guide)
  - [**NPM**](#npm)
  - [**Windows Standalone**](#windows-standalone)
- [**Usage**](#usage)
- [**CLI Responses**](#cli-responses)
  - [**StashCLIResponse<T>**](#stashcliresponset)
  - [**StashCLIError**](#stashclierror)
  - [**StashCLIErrorData**](#stashclierrordata)
- [**Paginated API**](#paginated-api)
  - [**Pagination Flags**](#pagination-flags)
- [**CLI Output Format**](#cli-output-format)
  - [**Table**](#table)
  - [**JSON**](#json)
  - [**CSV**](#csv)
- [**Core CLI Commands**](#core-cli-commands)
  - [**`stash help [COMMAND]`**](#stash-help-command)
  - [**`stash update`**](#stash-update)
  - [**`stash commands`**](#stash-commands)
  - [**`stash plugins`**](#stash-plugins)
  - [**`stash plugins:install PLUGIN...`**](#stash-pluginsinstall-plugin)
  - [**`stash plugins:inspect PLUGIN...`**](#stash-pluginsinspect-plugin)
  - [**`stash plugins:link PLUGIN`**](#stash-pluginslink-plugin)
  - [**`stash plugins:uninstall PLUGIN...`**](#stash-pluginsuninstall-plugin)
- [**Main CLI Topics**](#main-cli-topics)
  - [**Auth**](#auth)
  - [**Admin**](#admin)
  - [**App**](#app)
  - [**Groups**](#groups)
  - [**Hooks**](#hooks)
  - [**Logs**](#logs)
  - [**Markup**](#markup)
  - [**Profile**](#profile)
  - [**Projects**](#projects)
  - [**Repos**](#repos)
  - [**Tasks**](#tasks)
  - [**User**](#user)
- [**JSON Objects Schemes**](#json-objects-schemes)
  - [**AddGroupInput**](#addgroupinput)
  - [**AddUsersInput**](#addusersinput)
  - [**ApplicationProperties**](#applicationproperties)
  - [**Avatar**](#avatar)
  - [**Branch**](#branch)
  - [**ChangePasswordInput**](#changepasswordinput)
  - [**ChangeUserPasswordInput**](#changeuserpasswordinput)
  - [**ClusterOutput**](#clusteroutput)
  - [**ClusterNode**](#clusternode)
  - [**ClusterAddress**](#clusteraddress)
  - [**Comment**](#comment)
  - [**CommentAnchor**](#commentanchor)
  - [**CommentInput**](#commentinput)
  - [**Commit**](#commit)
  - [**CommitDiff**](#commitdiff)
  - [**CommitDiffHunk**](#commitdiffhunk)
  - [**CommitDiffHunk**](#commitdiffhunk-1)
  - [**CommitDiffLine**](#commitdiffline)
  - [**CommitDiffOutput**](#commitdiffoutput)
  - [**CreateUserInput**](#createuserinput)
  - [**FilePath**](#filepath)
  - [**ForkRepoInput**](#forkrepoinput)
  - [**HookDetails**](#hookdetails)
  - [**HookInput**](#hookinput)
  - [**HookOutput**](#hookoutput)
  - [**Group**](#group)
  - [**Instance**](#instance)
  - [**License**](#license)
  - [**LicenseStatus**](#licensestatus)
  - [**Line**](#line)
  - [**Link**](#link)
  - [**LinkRef**](#linkref)
  - [**Logger**](#logger)
  - [**MailHostConfiguration**](#mailhostconfiguration)
  - [**Participant**](#participant)
  - [**ParticipantInput**](#participantinput)
  - [**PermittedOutput**](#permittedoutput)
  - [**PermissionGroups**](#permissiongroups)
  - [**PermissionUsersOutput**](#permissionusersoutput)
  - [**PermissionUserOutput**](#permissionuseroutput)
  - [**Project**](#project)
  - [**ProjectInput**](#projectinput)
  - [**PullRequest**](#pullrequest)
  - [**PullRequestActivity**](#pullrequestactivity)
  - [**PullRequestActivityChanges**](#pullrequestactivitychanges)
  - [**PullRequestInput**](#pullrequestinput)
  - [**PullRequestRef**](#pullrequestref)
  - [**PullRequestRefInput**](#pullrequestrefinput)
  - [**PullRequestVeto**](#pullrequestveto)
  - [**PullRequestUpdateInput**](#pullrequestupdateinput)
  - [**Repository**](#repository)
  - [**RepoChangesOutput**](#repochangesoutput)
  - [**UpdateRepoInput**](#updaterepoinput)
  - [**TagOutput**](#tagoutput)
  - [**Task**](#task)
  - [**TaskInput**](#taskinput)
  - [**TaskCountOutput**](#taskcountoutput)
  - [**User**](#user-1)
  - [**UserInput**](#userinput)


# [**Installation Guide**]()

## [**NPM**]()

Installation with NPM manager is, at the moment, the unique way to install Stash CLI on Linux and MacOs systems. 

Install Node JS on your computer:

To install NodeJS on Windows systems go to [Node JS Webpage](https://nodejs.org/) and download the latest version for Windows.

To install NodeJS on Linux systems go to ["Installing Node.js via package manager"](https://nodejs.org/en/download/package-manager/) and choose the correct option according your linux system.

With NodeJS installed on your system, now open a terminal (CMD, Bash, Power Shell...) and run the next command:

    npm install -g cli-stash

## [**Windows Standalone**]()

If you don't want to install NPM on your windows system to install Stash CLI, can download the installer and install it without node on windows systemas.

  - [**Windows x64**](https://github.com/JJLongoria/stash-cli/raw/main/installers/stash-cli_win_x64.exe)

# [**Usage**]()
```sh-session
$ stash COMMAND [args] [flags]
running command...

$ stash --help [COMMAND]
...
```

# [**CLI Responses**]()

All commands **except Core CLI Commands** return the same response JSON Object for a better reponse handling and standarization. The JSON response definition is the next:

## [**StashCLIResponse<T>**]()

```js
{
	status: 0 | -1 = 0;		// Returned status. 0 OK, -1 KO
	message?: string;		// General execution status message
	result?: T;				// Response data when status is 0. (Not all Ok responses return data)
	error?: StashCLIError;	// Error data when status is -1.
}
```

The **`StashCLIResponse`** `result` property has **Generic type** (`T`), that means the result can be of any type defined in [**JSON Objects Schemes**](#json-objects-schemes) or primitive types likes `string` or `string[]` among others.

## [**StashCLIError**]()

The **`StashCLIResponse`** object contains the `StashCLIError` on `error` property to return the errors data. This object has the next definition:

```js
{
	statusCode?: number;			// The status code of execution
    status?: string;				// The error status
    statusText?: string;			// The error status text
    errors?: StashCLIErrorData[];	// Error details
}
```

## [**StashCLIErrorData**]()

The error object **`StashCLIError`** has a collection of errors with detailed error data, the JSON object is the next:

```js
{
	context?: string;		// Context of the error
    message: string;		// Error message
    exceptionName: string;	// Error exception name
}
```


# [**Paginated API**]()

The **Stash API Rest** work with **paginated results**, this means that the most of list commands return a **`Page<T>`** whith a collection of values of the requested data types. For example, when retrieve projects, get a **`Page<Project>`** with the paginated values.

The **`Page<T>`** object has the page data, size, limit and next page start among other data to use the paginated API. 

```ts
{
    size: number;               // The page size
    limit: number;              // The page limit
    isLastPage: boolean;     	// True if is the last page, false in otherwise
    values: T[];               	// Returned values collection.
    start: number;              // First page record
    filter?: any;               // Page filter
    nextPageStart?: number;     // First record of the next page
}
```

**IMPORTANT**: If more than one page exists (i.e. the response contains "isLastPage": false), the response object will also contain a **nextPageStart** attribute which must be used by the client as the start parameter on the next request. Identifiers of adjacent objects in a page may not be contiguous, so the start of the next page is not necessarily the start of the last page plus the last page's size. A client should always use **nextPageStart** to avoid unexpected results from a paged API.

## [**Pagination Flags**]()

All commands that support paginations (the most of list commands) has the same flags to support and user the paginated api, this flags are listed below:
| Name      | flag      | Type          | Description                                                                  |
| --------- | --------- | ------------- | ---------------------------------------------------------------------------- |
| **All**   | `--all`   | [`Boolean`]() | Return all records on the same page (instead paginate results)               |
| **Limit** | `--limit` | [`Integer`]() | Indicates how many results to return per page                                |
| **Start** | `--start` | [`Boolean`]() | Indicates which item should be used as the first item in the page of results |

# [**CLI Output Format**]()

The Stash CLI support to return the output in different formats, CSV, JSON and Table. All commands support the JSON Output. All commands that return data into the `result` property support Table and CSV outputs. All commands that support tables, support also CSV output.

## [**Table**]()

Is the standard output if not select any other type, this is the best human readable response. All commands that support CSV output, support tables output too. To many commands has the `--extended` flag. This flag is for show more columns on the tables (By default, not show all columns in many commands).

## [**JSON**]()

Is the most complete response and the best to work with the command, but is not human readable like a table. The flag to return a JSON output is `--json`

## [**CSV**]()

To many commands support to format the output as JSON (the same with output as table). This response contains the same information of an extended table but in different format. The flag to format as csv is `--csv`.


# [**Core CLI Commands**]()

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


# [**Main CLI Topics**]()

The [**Stash CLI Application**]() has to many commands to handle all Stash features. All commands are grouped in **topics**, any many topics has **subtopics** to better organization of commands (and better to learn and understand).

The main topics are listed below.

## [**Auth**]()

Topic with all auth related matters like **list** authorized **stash instances** and **login** and **logout** from Stash instances. 

## [**Admin**]()

Topic to work with all administration related tasks like **Create groups** or **users**, **grant** or **revoke** general **permissions**, get or update de **license**, manage the **mail server** or see the Stash **clusters**

## [**App**]()

Topic to view the **application properties**

## [**Groups**]()

Topic to **search groups** on Stash. To create or manage groups use the [**Admin groups commands (admin:groups:...)**](#admin).

## [**Hooks**]()

Topic to work with **Hook's Avatars**. To work with Hooks (list, update...) use the [**Project Repo settings (projects:repos:settings:hooks...)**](#projects).

## [**Logs**]()

Topic with all matters related to the Stash **Logs** like **view** or **change** **log levels** from any logger, including root logger.

## [**Markup**]()

Topic to **preview as HTML** (and save) **markdown files** (or markdown content). 

## [**Profile**]()

Topic with all profile commands. **List** all **recent viewed repositories** by the logged user.

## [**Projects**]()

The **bigger topic** of Stash CLI because contains all commands to work with the **Stash Projects**. You can *create*, *update* *delete*... any **project**, can work with **project repositories**, make **pull request** to any branch for any repository, **list** *commits*, *changes*, handle **project** and **repository** **permissions** and to much more.

Also can work with personal repository if use the user slug like **"~userSlug"** instead the prokect key on all commands that support it on the **--project** flag.

## [**Repos**]()

This topic contains operations to **search repositories**, to work with repositories, use [**Project Repository commands (projects:repos:settings:hooks...)**](#projects).

## [**Tasks**]()

Topic to work with **Tasks** like *create*, *update*, *list* or *delete*.

## [**User**]()

Topic with all commands related to **the users** (and the **logged user**). List or search users or update information about the logged user like details or avatar.


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
## [**ApplicationProperties**]()
```json
{
  "version": "string",
  "buildNumber": "number",
  "buildDate": "number",
  "displayName": "string",
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
## [**ChangePasswordInput**]()
```json
{
    "password": "string",
    "passwordConfirm": "string",
    "name": "string",
}
```
---
## [**ChangeUserPasswordInput**]()
```json
{
    "password": "string",
    "passwordConfirm": "string",
    "oldPassword": "string",
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
## [**Comment**]()
```json
{
    "properties": "{ [key: string]: string }",
    "id": "number",
    "version": "number",
    "text": "string",
    "author": "User",
    "createdDate": "number",
    "updatedDate": "number",
    "comments": "Comment"[],
    "attributes": "{ [key: string]: string }",
    "tasks": "{ [key: string]: string }",
    "permittedOperations": {
        "editable": "boolean",
        "deletable": "boolean",
    }
}
```
- See [`User`](#user) Definition

---
## [**CommentAnchor**]()
```json
{
    "fromHash?": "string",
    "toHash?": "string",
    "line?": "number",
    "lineType?": "'ADDED' | 'REMOVED' | 'CONTEXT'",
    "fileType?": "'FROM' | 'TO'",
    "path?": "string",
    "srcPath?": "string",
    "orphaned?": "boolean",
}
```
- See [`User`](#user) Definition

---
## [**CommentInput**]()
```json
{
    "text": "string",
    "parent?": "string",
    "commentAnchor?": "CommentAnchor"
}
```
- See [`commentAnchor`](#commentanchor) Definition
- See [`User`](#user) Definition

---
## [**Commit**]()
```json
{
    "id": "string",
    "displayId": "string",
    "author": "User",
    "authorTimestamp": "number",
    "message": "string",
    "parents": "Commit[]",
    "attributes": "{ [key: string]: string }",
}
```
- See [`User`](#user) Definition

---
## [**CommitDiff**]()
```json
{
    "source": "FilePath",
    "destination": "FilePath",
    "hunks": "CommitDiffHunk[]",
    "truncated": "boolean",
}
```
- See [`FilePath`](#filepath) Definition
- See [`CommitDiffHunk`](#commitdiffhunk) Definition

---
## [**CommitDiffHunk**]()
```json
{
    "sourceLine": "number",
    "sourceSpan": "number",
    "destinationLine": "number",
    "destinationSpan": "number",
    "segments": "CommitDiffHunkSegment[]",
    "truncated": "boolean",
}
```
- See [`CommitDiffHunkSegment`](#commitdiffhunksegment) Definition

---
## [**CommitDiffHunk**]()
```json
{
    "type": "string",
    "lines": "CommitDiffLine[]",
    "truncated": "boolean",
}
```
- See [`CommitDiffLine`](#commitdiffline) Definition

## [**CommitDiffLine**]()
```json
{
    "destination": "number",
    "source": "number",
    "line": "string",
    "truncated": "boolean",
}
```

---
## [**CommitDiffOutput**]()
```json
{
    "diffs": "CommitDiff[]",
}
```
- See [`CommitDiff`](#commitdiff) Definition

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
## [**HookDetails**]()
```json
{
    "key": "string",
    "name": "string",
    "type": "'PRE_RECEIVE' | 'POST_RECEIVE'",
    "description": "string",
    "version": "string",
    "configFormKey?": "string",
}
```
---
## [**HookInput**]()
```json
{
    "details": "HookDetails",
    "enabled": "boolean",
    "configured": "boolean",
}
```
- See [`HookDetails`](#hookdetails) Definition

---
## [**HookOutput**]()
```json
{
    "details": "HookDetails",
    "enabled": "boolean",
    "configured": "boolean",
}
```
- See [`HookDetails`](#hookdetails) Definition

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
## [**Logger**]()
```json
{
    "logLevel": "'TRACE' | 'DEBUG' | 'INFO' | 'WARN ' | 'ERROR'",
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
    "role": "'AUTHOR' | 'REVIEWER' | 'PARTICIPANT'"
}
```
---
## [**PermittedOutput**]()
```json
{
    "permitted": "boolean",
}
```
---
## [**PermissionGroups**]()
```json
{
    "group": "User",
    "permission": "'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN' | 'PROJECT_READ' | 'PROJECT_WRITE' | 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN'",
}
```
- See [`Group`](#group) Definition

---
## [**PermissionUsersOutput**]()
```json
{
    "user": "User",
    "permission": "'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN' | 'PROJECT_READ' | 'PROJECT_WRITE' | 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN'",
}
```
## [**PermissionUserOutput**]()
```json
{
    "user": "User",
    "deletable": "boolean",
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
## [**PullRequestActivity**]()
```json
{
    "id": "number",
    "createdDate": "number",
    "user": "User",
    "action": "string",
    "commentAction?": "string",
    "comment?": "Comment",
    "commentAnchor?": "CommentAnchor",
    "fromHash?": "string",
    "previousFromHash?": "string",
    "previousToHash?": "string",
    "toHash?": "string",
    "added?": "PullRequestActivityChanges",
    "removed?": "PullRequestActivityChanges",
}
```
- See [`User`](#user) Definition.
- See [`Comment`](#comment) Definition.
- See [`CommentAnchor`](#commentanchor) Definition.
- See [`PullRequestActivityChanges`](#pullrequestactivitychanges) Definition.

---
## [**PullRequestActivityChanges**]()
```json
{
    "changesets?": "Commit[]",
    "commits?": "Commi[]",
    "total": "number",
}
```
- See [`Commit`](#commit) Definition.

---
## [**PullRequestInput**]()
```json
{
    "title": "string",
    "description": "string",
    "state": "'ALL' | 'OPEN' | 'DECLINED' | 'MERGED'",
    "open?": "boolean",
    "closed?": "boolean",
    "fromRef": "PullRequestInputRef",
    "toRef": "PullRequestInputRef",
    "locked?": "boolean",
    "reviewers?": "ParticipantInput[]",
}
```
- See [`PullRequestInputRef`](#pullrequestrefinput) Definition.
- See [`ParticipantInput`](#participantinput) Definition.

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
## [**PullRequestUpdateInput**]()
```json
{
    "title?": "string",
    "description?": "string",
    "toRef?": "PullRequestInputRef",
    "reviewers?": "ParticipantInput[]",
}
```
- See [`PullRequestInputRef`](#pullrequestrefinput) Definition.
- See [`ParticipantInput`](#participantinput) Definition.

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
- See [`Project`](#projects) Definition
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
    "link": "Link",
    "links": "{ [key: string]: LinkRef[] }",
}
```
- See [`FilePath`](#filepath) Definition
- See [`Link`](#link) Definition.
- See [`LinkRef`](#linkref) Definition

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
## [**TagOutput**]()
```json
{
    "id": "string",
    "displayId": "string",
    "latestChangeset": "string",
    "latestCommit": "string",
    "hash": "string",
}
```
---
## [**Task**]()
```json
{
    "id": "number",
    "properties": "{ [key: string]: string }",
    "anchor": "Comment",
    "author": "User",
    "createdDate": "number",
    "permittedOperations": {
        "deletable": "boolean",
        "editable": "boolean",
        "transitionable": "boolean",
    },
    "text": "string",
    "state": "'OPEN' | 'RESOLVED'",
}
```
- See [`Comment`](#comment) Definition
- See [`User`](#user) Definition

## [**TaskInput**]()
```json
{
    "anchor": {
        "id": "string",
        "type": "string"
    },
    "text": "string",
    "state": "'OPEN' | 'RESOLVED'",
}
```
---
## [**TaskCountOutput**]()
```json
{
    "open": "number",
    "resolved": "number",
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
## [**UserInput**]()
```json
{
    "name?": "string",
    "emailAddress?": "string",
    "displayName?": "string",
    "type?": "string",
    "directoryName?": "string",
    "deletable?": "boolean",
    "lastAuthenticationTimestamp?": "number",
    "mutableDetails?": "boolean",
    "mutableGroups?": "boolean",
}
```
---
