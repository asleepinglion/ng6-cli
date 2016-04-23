# ng6-cli

> These tools are currently under active development and will continue to be improved and refined. Please let me know if you are interested in collaboration! All submissions (issues, feature requests, pull requests, or othewrise) are welcome and very much appreciated!

The **`ng6`** cli provides a set of tools to automate and simplify the development of modern large-scale angular applications. This includes tools for scaffolding new applications (web & mobile) as well as angular artifacts such as **`modules`**, 
**`components`**, **`directives`**, **`services`**, and **`filters`**.

**`ng6`** doesn't just create files, it will also intelligently help you refactor existing code. For example, when scaffolding new artifacts it will automatically create the appropriate structure, necessary, including module files and the appropriate linking (i.e. import statements, angular definitions, and dependencies). 

This is achieved by combining a consistent & predictable achitecture with the power of [acorn.js](https://github.com/ternjs/acorn), a fast static analysis library for parsing the Abstract Syntax Tree of the Javascript codebase.  

**`ng6`** is also easy to extend. You can extend the entire CLI to create your own custom version, or simply create new commands and template to supplement or replace the provides ones.


##Installing

You can use the npm to install the ng6-cli:

```
npm install -g ng6-cli
```

##Getting Started

To get a list of available commands, simply run `ng6`:

```
ng6
```

To get help with a specific command:

```
ng6 help [command]
```

##Configuration

> The **`ng6 config`** will be available shortly to make it easier to configure the CLI options for your user or project.

You can configure **`ng6`** options at the user or project levels. This is done by creating a `.ng6-cli` file in either your home directory or the project directory. User level options will override project level settings. 

> At the moment there are no ng6exposed options, so this feature isn't very helpful. But in the future this will allow you to enable or disable features as well as provide configuration settings for publishing and consuming modules.

The file used for configuration settings can be changed if you are extending the CLI itself. Please see the section on extending the CLI below.

## Commands

We are actively working to develop and expand on these commands in an effor to further improve the developer experience. If you have any ideas or want to submit a new command, please feel free to contact me or submit a pull request.

> You can also create your own [Custom Commands!](docs/comands.md) 
 
- **`ng6 serve`** Watch, build, & serve the application in a local environment.
- **`ng6 build`** Build the project with webpack.
- **`ng6 list`** List available artifacts, such as templates & components.
- **`ng6 new`** Scaffold a artifact such as a component or a service.
- **`ng6 copy`** Copy an artifact to a new location.
- **`ng6 move`** Move an artifact.
- **`ng6 help`** Display help infomation.

##Table of Contents

- [Application Architecture](docs/architecture.md)
- [CLI Architecture](docs/cli-architecture.md)
- [Application Scaffolding](docs/scaffolding.md)
- [Serving via BrowserSync](docs/local-development.md)
- [Testing on Mobile Devices](docs/mobile-development.md)
- [Custom Commands](docs/commands.md)
- [Custom Templates](docs/templates.md)

##Future Plans

- Installed Commands & Templates
- SystemJS Templates
- TypeScript Templates
- Application Designer
- Sketch File Conversion

##Collaboration

All questions, ideas, feedback, and/or pull requests are also greatly appreciated! 
