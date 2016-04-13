# ng6-cli

> These tools are currently under active development and will continue to be improved and refined. Please let me know if you are interested in collaboration! All submissions (issues, feature requests, pull requests, or othewrise) are welcome and very much appreciated!

The `ng6` cli provides a set of tools to automate and simplify the development of modern large-scale angular applications. This includes tools for scaffolding new applications (including mobile via [Ionic]()) and all the angular artifacts such as `modules`, 
`components`, `directives`, `services`, and `filters`.

`ng6` doesn't just create files, it will also intelligently help you refactor existing code. When scaffolding new files it will automatically create the appropriate structure, necessary module files, and appropriate linking (i.e. import statements, angular definitions, and dependencies). 

`ng6` is also easy to extend. You can extend the entire CLI to create your own custom version, or simply create new commands and template to supplement or replace existing commands and templates.

##Installing

You can use the npm to install the ng6-cli:

```bash
npm install -g ng6-cli
```

##Getting Started

To get a list of available commands, simply run `ng6`:

```bash
ng6
```

To get help with a specific command:

```bash
ng6 help [command]
```

##Configuration

##Component Architecture

In its simplest form `ng6` is the combination of the new [angular.component](https://docs.angularjs.org/guide/component) method and ES6 Modules. 

The `ng6` cli is loosely based off the [NG6 Starter project](https://github.com/AngularClass/NG6-starter), with a number of small changes that follow the conventions of the architecture more closely. 

Components have been entirely isolated from the host application and the build system. In the current templates, we use [Webpack]() to build the application. ES6 is made available via Babel.

>It would be relatively easy to use [browserify]() or [rollup]() instead -- the only requirement is that modules should be processed using a build system that supports CommonJS modules.

For mobile applications, we take advantage of the same achitecture, but some small changes to support [Ionic]().

### More Information...

- [Angular ES6 Style Guide](https://github.com/rwwagner90/angular-styleguide-es6#modularity)
- [Exploring the Angular 1.5 .component() method](https://toddmotto.com/exploring-the-angular-1-5-component-method/)
- [Component Pattern](https://github.com/tomastrajan/component-pattern-for-angular-js-1-x)
- [How to design large AngularJS applications that scale – Sebastian Fröstl and Gernot Höflechner](https://www.youtube.com/watch?v=eel3mV0alEc)
- [How Instagram.com Works - Pete Hunt](https://www.youtube.com/watch?v=VkTCL6Nqm6Y)

##Scaffolding

```bash
ng6 new [type:template] [component-name]
```

To create a new application using the default template and install dependencies:
> This will create a new folder within the current working directory.

```bash
ng6 new app [app-name] -i
```

To create a new application using the mobile template and install dependencies:
> This will create a new folder within the current working directory.

```bash
ng6 new app:mobile [app-name] -i
```

To create a new view component (a component which contains a ui-router state):
> You will probably need to modify the ui-router state's url as it will default to the name of the component.

```bash
ng6 new component:view [component-name]
```

To create a regular component:

```bash
ng6 new component [component-name]
```

To see a list of available templates for generation organized by type:

```bash
ng6 list templates
```


##Templates

##Commands

##Customize!

##Future Plans

##Collaboration