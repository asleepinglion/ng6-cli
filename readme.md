# ng6-cli
#### Development Tools for Large-Scale Angular Apps with ES6, Webpack, & the Component Architecture!

> These tools and this documentation are currently under active development and will continue to be improved and refined. Please let me know if you're interested in collaborating with us! 
>
> **All submissions (issues, feature requests, pull requests, or othewrise) are welcome and very much appreciated!**

The **`ng6-cli`** provides a set of tools to automate and simplify the development of modern large-scale angular applications. This includes tools for scaffolding new applications (web & mobile) as well as angular artifacts such as **`modules`**, 
**`components`**, **`directives`**, **`services`**, and **`filters`**.


## Highlights

####Focus On The Experience!

The **`ng6-cli`** doesn't just create files, it will also intelligently help you refactor existing code. For example, when scaffolding new artifacts it will automatically create the appropriate structure, module files, and necessary linking (i.e. import statements, angular definitions, and dependencies). This allows you to move quickly and maintain your focus where it should be, developing amazing user experiences! 

This is achieved by combining a consistent & predictable achitecture with the power of a fast static analysis library for parsing the Abstract Syntax Tree of the Javascript codebase ([acorn.js](https://github.com/ternjs/acorn)). Several declarative libaries have also been created to assist in template geneartion, code reflection, and refactorization. 

####Scalable Architecture

By isolating application components from the host application and build system, the components become portable and can easily be consumed by other applications. This type of architecture works for small projects, but also for large projects with many teams working on different parts of the application at different lifecycles. The architecture encourages decoupling and composability; it empowers developers to use solid principles like single responsibility to foster greater reuse and collaboration. As the project grows, it should get easier to build and refactor, not harder!

>One of the future plans is to release a set of commands to assist in the process of publishing, installing, cloning, and forking modules & components.

####Make It Your Own!

Even more, the **`ng6-cli`** is easy to extend. You can extend the entire CLI to create your own command line interface customized for your project, team, or enterprise. 

> **Hint:** Use it to power your next style guide!

Or you can simply create new commands and templates within the scope of your project to augment or replace the provided ones. Commands & templates created at the project level will be loaded first overriding the commands & templates created at lower levels.

All of this is primarily achieved by using a simple inheritance model. "Classes" are created using an `.extend` convention, starting with base classes for the CLI, Commands, & Templates. This allows other commands, templates and CLIs created with **`ng6-cli`** to be extended and modified at any level.

#### Code Analysis & Refactorizations

By combinging the same techniques used by modern linting tools like ESLint and JSCS with the knowledge of this particular architecture, we are able to improve the developer experience and make tools that can continue to provide use beyond initial project creation.

As mentioned, [acorn.js](https://github.com/ternjs/acorn) is used to parse the abstract syntax tree. Instead of modifying the AST and using escodegen to convert it back to JS (which causes all sorts of side effects to the code, lost formatting, etc), the **`ng6-cli`** simply uses the region information to know where to insert text. The convetions of the architecture inform the naming and location of files. This empowers the creation of a powerful set of tools to develop rapidly & focus on the actual app, not the glue the binds it all together.

> In the very near future we will also support tools for moving and copying artifacts. Your IDE can certainly help you do a lot of these things, but the tooling has the advantage of understanding the specific architecture at play.


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

> At the moment there are no exposed options, so this feature isn't very helpful. But in the future this will allow you to enable or disable features as well as provide configuration settings for things like, publishing and consuming modules.

The file used for configuration settings can be changed if you are extending the CLI itself. Please see the section on extending the CLI below.

## Tool Overview

We are actively working to develop and expand on these commands in an effor to further improve the developer experience. If you have any ideas or want to submit a new command, please feel free to contact me or submit a pull request.

> You can also create your own [Custom Commands!](docs/comands.md) 
 
- **`ng6 serve`** Watch, build, & serve the application in a local environment.
- **`ng6 build`** Build the project with webpack.
- **`ng6 list`** List available artifacts, such as templates & components.
- **`ng6 new`** Scaffold a artifact such as a component or a service.
- **`ng6 copy`** Copy an artifact to a new location.
- **`ng6 move`** Move an artifact.
- **`ng6 help`** Display help infomation.

##Documentation

- [Application Architecture](docs/architecture.md)
- [CLI Architecture](docs/cli-architecture.md)
- [Application Scaffolding](docs/scaffolding.md)
- [Local Development](docs/local-development.md)
- [Mobile Devices & Emulation](docs/mobile-development.md)
- [Custom Commands](docs/commands.md)
- [Custom Templates](docs/templates.md)

##What's Next?

- Class & Method JSDocs
- Build Optimizations
- Linting Tools & Tests
- Improved Documentation
- Installed Commands & Templates
- Publishing & Consuming Modules
- SystemJS Templates
- TypeScript Templates
- Sketch File Conversion
- Application Designer


##Collaboration

All questions, ideas, feedback, and/or pull requests are also greatly appreciated! 
