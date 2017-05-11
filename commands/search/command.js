var chalk = require('chalk');
var inquirer = require('inquirer');
var escExit = require('esc-exit');
var copyPaste = require('copy-paste');
var Command = require('../../lib/command');
var fuzzy = require('fuzzy');
var open = require('opn');

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Search for files & components within this project.';
    this.options = '';
    this.category = 'other';
    this.order = 8;

  },

  run: function() {

		if (this.cli.request.getOption('open') === true) {
			console.log(chalk.yellow('When using the ' + chalk.cyan('--open') + ' command you must specify an app'));
			console.log('For example: ' + chalk.cyan('ng6 search --open atom'));
			console.log();
			console.log(chalk.red('Please try again!'));
			process.exit(1);
		}

		escExit();
		this.projectRoot = this.cli.reflect.projectRoot();
		this.projectName = this.cli.reflect.projectName();

		var files = this.cli.traverse.files(file => ({
			search: file.replace(this.projectRoot + '/', ''),
			display: file.replace(this.projectRoot, this.projectName)
		}));
		this.listFiles(files);
  },

	listFiles: function(files) {
		inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

		return inquirer.prompt([{
			name: 'file',
			message: 'Search for file:',
			type: 'autocomplete',
			pageSize: 10,
			source: (answers, input) => this.filterFiles(input, files)
		}])
			.then(answer => {
				var fullPath = answer.file.replace(this.projectName, this.projectRoot)

				if (this.cli.request.getOption('copy')) {
					copyPaste.copy(fullPath, () => {
						console.log(chalk.white('Copied ' + chalk.cyan(fullPath) + ' to clipboard!'));
					});
				}

				if (this.cli.request.getOption('open')) {
					const app = this.cli.request.getOption('open');

					console.log(chalk.white('Openning ' + chalk.cyan(fullPath) + ' with ' + chalk.cyan(app)));
					open(fullPath, { wait: false, app })
						.catch((err) => {
							console.log(chalk.red('Failed to open app: ') + app)
							console.log(err);
							process.exit(1);
						});
				}
			})
			.catch((err) => {
				console.log(chalk.red('Something went wrong!'));
				console.log('If you think this is an issue with the project please open up an issue at');
				console.log(chalk.green('https://github.com/UltimateSoftware/ng6-cli/issues/new'));
				console.log('here is the error: ');
				console.log(err);
				process.exit(1);
			});
	},

	filterFiles: function(input, files) {
		return Promise.resolve().then( () => input ? fuzzy
			.filter(input, files, { extract: file => file.search })
			.map(f => f.original.display)
			: files.map(f => f.display)
		);
	}

});
