# CLI Architecture

### Developed to be easy to maintain, refactor, & extend.

It was important during the development of the CLI to make sure it was not only easy to maintain & refactor the code by using SOLID principles, but also that commands, templates, and even the CLI itself is easy to extend and customize. 

To make things easy, dynamic, and extendable, the CLI uses the [Simple Inheritance Model](#simple_inheritance_model) for 
ES5. To make the code easy to maintain and refactor, several declarative libaries were created to generate new files, reflect information about the code, and refactor the code using the Abstract Syntax Tree (AST).

**Why ES5?**

We chose ES5 because we wanted to maximize our support Node engines (as many are still using Node 4) and even more so because we wanted to maximize our ability to load commands & templates at run-time. Using the latest Node engine or requiring Babel to transpile felt a bit too limiting and complex. It also just keeps things relatively simple during development when your using a number of symlinks between many connected projects. 

## Applciation Structure

The application is composed of templates, commands, and a number of single purpose class libraries that provide most of the functionality in a resusable, declarative form. 

```js
bin/
../ng6-cli.js //the bin script (instantiates cli.js)
commands/ //commands provided with the ng6-cli
../build //a command
../../command.js //class for this command
../../help.md //command specific help template 
../...
docs/ //you are here
lib/ //library of classes to support the ng6-cli
../cli.js //the base class for CLIs
../command.js //base class for commands
../commands.js //class which loads commands
../config.js //class to manage configuration options
../generate.js //class to generate new apps & artifacts
../ng6-cli.js //ng6 extension of the base CLI class
../refactor.js //class to modify existing code 
../reflect.js //class to reflect on the code & project
../request.js //class to process the request (argv parser)
../template.js //base class for templates
../templates.js //class which loads templates
templates/ //templates provided with the ng6-cli
../app/ //template type
../../default //name of template
../../../template //folder to contain template files
../../../template.js //class for this template
../... 
index.js //exposes classes for easy extension
```

## How It Works

### Installation:

During installation the bin script file is associated with the system and becomes the main entry point of the application when the command is executed. The bin script, however, is really just a shell as it simply instantiates an instance the of the ng6-cli class (`lib/ng6-cli.js`), which is found among the other classes in the `lib/` folder.  

The ng6-cli class is an extension of the the base CLI class (`lib/ng6-cli.js`) which is the basis for all functionality provided by the CLI. 

### Boot Process:

When the base CLI class is instantiated it in turn instantiates and stores references to the other libraries used by the system: `config`, `request`, `commands`, `templates`,  `reflect`, `generate`, and `refactor`.

> The CLI can be customized and extended simply by extending `lib/cli.js` and instantiating the sub class in a new bin script. For more information on creating your own custom CLI checkout the [Custom CLI](https://github.com/asleepinglion/ng6-cli/blob/master/docs/custom-cli.md) documentation.

After instantiating the libraries the CLI class proceeds to load any found templates or commands it can find within the current directory, the project root if it can find one, and finally within the ng6-cli package itself. CLIs that extend this override the `load` method to tell the system to search other paths as well.

> **Helpful Tip:** To see a list of all the folders and files loaded you can use `--debug` option when executing any command.
 
Once commands & templates have been loaded the `run` method is exected where the CLI checks whether the request command exists and either executes the command or defaults to the help command.

### Generation, Reflection, & Refactorization:

Documentation in progress...


## Simple Inheritance Model

The base `Class` ([Ouro Base](https://github.com/asleepinglion/ouro-base) ) provides an `extend` method to allow one class to pass its behavior on to another using prototypical inheritance. Mixins are supported by passing in previously created Classes as prefixed aguments. You can even call parent methods from within child classes via the `_super` method. 

**The syntax is pretty straight forward, take a look:**

```javascript
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