# CLI Architecture

### Developed to be easy to maintain, refactor, & extend.

It was important during the development of the CLI to make sure it was not only easy to maintain & refactor the code by using SOLID principles, but also that commands, templates, and even the CLI itself is easy to extend and customize. 

To make things easy, dynamic, and extendable, the CLI uses the [Simple Inheritance Model](#simple_inheritance_model) for 
ES5. To make the code easy to maintain and refactor, several declarative libaries were created to generate new files, reflect information about the code, and refactor the code using the Abstract Syntax Tree (AST).

#### Why ES5?

We chose ES5 because we wanted to maximize our support Node engines (as many are still using Node 4) and even more so because we wanted to maximize our ability to load commands & templates at run-time. Using the latest Node engine or requiring Babel to transpile felt a bit too limiting and complex. It also just keeps things relatively simple during development when your using a number of symlinks between many connected projects. 

## Applciation Structure

The application is composed of templates, commands, and a number of single purpose class libraries that provide most of the functionality in a resusable, declarative form. 

```bash
bin/
../ng6-cli.js #the bin script (instantiates cli.js)
commands/ #commands provided with the ng6-cli
../build #a command
../../command.js #class for this command
../../help.md #command specific help template 
../...
docs/ #you are here
lib/ #library of classes to support the ng6-cli
../cli.js #the base class for CLIs
../command.js #base class for commands
../commands.js #class which loads commands
../config.js #class to manage configuration options
../generate.js #class to generate new apps & artifacts
../ng6-cli.js #ng6 extension of the base CLI class
../refactor.js #class to modify existing code 
../reflect.js #class to reflect on the code & project
../request.js #class to process the request (argv parser)
../template.js #base class for templates
../templates.js #class which loads templates
templates/ #templates provided with the ng6-cli
../app/ #template type
../../default #name of template
../../../template #folder to contain template files
../../../template.js #class for this template
../... 
index.js #exposes classes for easy extension
```

## How It Works

### Installation:

During installation the bin script file is associated with the system and becomes the main entry point of the application when the command is executed. The bin script, however, is really just a shell as it simply instantiates an instance the of the ng6-cli class (`lib/ng6-cli.js`), which is found among the other classes in the `lib/` folder.  

The ng6-cli class is an extension of the the base CLI class (`lib/ng6-cli.js`) which is the basis for all functionality provided by the CLI. 

### Boot Process:

When the base CLI class is instantiated it in turn instantiates and stores references to the other libraries used by the system: `config`, `request`, `commands`, `templates`,  `reflect`, `generate`, and `refactor`.

> The CLI can be customized and extended simply by extending `lib/cli.js` and instantiating the sub class in a new bin script. For more information on creating your own custom CLI checkout the [Custom CLI](https://github.com/asleepinglion/ng6-cli/blob/master/docs/custom-cli.md) documentation.

> **Helpful Tip:** To see a list of all the folders and files loaded during the boot process you can use `--debug` option when executing any command.

After instantiating the necessary libraries, the CLI class proceeds to load any templates or commands it can find within the current directory, the project root, and finally within the ng6-cli package itself. Extended CLIs can override the `load` method to tell the system to search additional paths, but the current directory and project root will always be checked first. Subsequent commands or templates with the same name as a template or command already loaded will be ignored. Extension is possible by having your new command or template `extend` the original command or template.
 
Once commands & templates have been loaded the `run` method is exected where the CLI checks whether the request command exists and either executes the command or defaults to the help command.

### Commands & Templates

Any commands or templates that are found in the search paths will be automatically loaded and available to use within the system. Each command and template is stored in own folder. Templates have a slightly more complicated structure, with an additional folder which groups templates by type. 

Commands are composed of a `command.js` class file which either extends the base Command class or another command. Each command also has a `help.md` file which is a markdown template that is rendered into the console when the user uses the specific help method: `ng6 help [command]`. 

Templates contain a template folder which contains all the files that will be created and a template.js file which either extends the base Template class or another template.

Both commands and templates set descriptions and other options as variables within their class's `init` method. The descriptions are used by the `help` command and the options are used for things like the Template's `extend` option. When the `extend` option is set to true on a Template, the files within the template are layered on top of any template of the same name from a lower level (i.e. augmenting a ng6-cli template at the project level).

### Generation, Reflection, & Refactorization:

Likely the most useful features of the CLI are contained within these three declarative libraries. Using these libraries its extremely easy to generate new files and modify existing code to wire up import statements and angular dependencies. The same libraries also enable the ability to assist in other simple refactorization operations that typically take several steps in traditional IDEs.

#### Generation

When the `new` command is executed, it determines the template type, name & destination and calls the appropriate create method on the generation class (`lib/generate.js`). There are currently five creation methods: `createApp`, `createModule`, `createArtifact`, `createTemplate`, `createCommand`. 

- `createApp` is specifically used for creating new applications, it expects a `template` name, application `name`, and a `destination.

- `createModule` is specifically used for creating new modules it expects a `name`, `destination`, and an optional `callback`. The callback is used by other artifact which may call `createModule` if a module file doesn't exist for the type of artifact they creating. 

- `createArtifact` is used for most Angular artifacts including `components`, `directives`, `services`, `filters`, & `providers`. It expects a artifact `type`, template `name`, `destination`, and an optional `callback`.

- `createTemplate` and `createCommand` are used to create new CLI commands and templates. They both only require a `name` as new commands and templates will always be stored in either a `commands` or `templates` folder at the project root.

#### Reflection

When creating new modules and artifacts the `createModule` and `createArtifact` methods which use the reflection library (`lib/reflect.js`) to determine information about the current project. 

Using static analysis (using the same library that powers ESLint and JSCS) we are able to parse the Abstract Syntax Tree of the code and do things like, find the final character position of the last import statement. Using this information, combined with information known about the expected architecture of the application, the system is able to tell the refactorization library what and where to modifications. 

There are number of methods that make for a really declarative interface for template generation and refactoriztion, for example: `getNewArtifactPath` which determines the path for a new artifact based on the type, template name, and desired artifact name. Or `findParentModule` which will find the parent module file for a given file within the project.

#### Refactorization

The refactorization library completes the process by using the information returned from the reflection library to modify existing files for things like module import statements and angular dependencies. 

- `addAngularDefinition` adds a new angular definition (i.e. angular.service, angular.component, etc) to an existing module file. It expects an `options` object expression as its only argument, with the following required options `name`, `type`, and `module`.

- `addAngularDependency` adds a dependency to an existing module file's angular.module definition. It expects an `options` object expression as its only argument, with the following required options `identifier`, and `module`.

- `addModuleImport` adds an import statement to an existing module. It expects an `options` object expression as its only argument, with the following required options `identifier`, `parent`, and `child`.


## Simple Inheritance Model

The base `Class` ([Ouro Base](https://github.com/asleepinglion/ouro-base) ) provides an `extend` method to allow one class to pass its behavior on to another using prototypical inheritance. Mixins are supported by passing in previously created Classes as prefixed aguments. You can even call parent methods from within child classes via the `_super` method. 

**The syntax is pretty straight forward, take a look:**

```js
var Class = require('ouro-base');

var Person = Class.extend({
  init: function() {
	console.log('I am a person');
  },

  jump: function() {
	this.emit('jumping');
  }
});

var Female = Person.extend({
  init: function() {
	this._super();
	console.log('I am a female.');
  }
});

var Ninja = Female.extend({
  init: function() {
	this._super();
	console.log('I am a ninja.');

	this.on('jumping', function() {
	  console.log("I'm jumping like a sexy ninja.");
	});
  }
});

```

You simply pass in an object containing your methods and variables as the last argument of the `extend` method. 

Mixins are passed in as the first arguments of the `extend` method and they're methods and properties will be mixed in sequentially using prototypical inheritance, from the first argument to the last, your custom definition. For more information, check out the [Ouro Base](https://github.com/asleepinglion/ouro-base) project on GitHub.
