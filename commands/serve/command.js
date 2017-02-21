var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var detect = require('detect-port');
var Ora = require('ora');
var _ = require('lodash');
var Command = require('../../lib/command');
var clearConsole = require('../../utils/clearConsole');
var formatWebpackMessages = require('../../utils/formatWebpackMessages');

process.env.NODE_ENV = 'development';

var DEFAULT_PORT = process.env.PORT || 3000;

module.exports = Command.extend({

  init: function() {

    this._super.apply(this, arguments);

    this.description = 'Watch, build, & serve the application in a local environment.';
    this.options = '';
    this.category = 'build';
    this.order = 1;
  },

  checkProject: function() {

    //resolve project root
    var projectRoot = this.cli.reflect.projectRoot();

    if( !projectRoot || projectRoot != process.cwd() ) {
      console.log();
      console.log(chalk.white('You must be in the project root in order to execute serve!'));
      console.log();
      process.exit(1);
    }

    var nodeModulesExists = fs.existsSync(path.join(projectRoot, 'node_modules'));

    if( !nodeModulesExists ) {
      console.log();
      console.log(chalk.white('All dependencies seem to be missing. Have you run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + '?'));
      console.log();
      process.exit(1);
    }

    var nodeModules = fs.readdirSync(path.join(projectRoot, 'node_modules'));
    var pkg = require(path.join(projectRoot, 'package.json'));

    if( nodeModules.length < (pkg.dependencies.length + pkg.devDependencies.length) ) {
      console.log();
      console.log(chalk.white('Some dependencies seem to be missing. Have you run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + '?'));
      console.log();
      process.exit(1);
    }

    var webpackExists = fs.existsSync(path.join(projectRoot, 'node_modules', 'webpack'));
    var webpackDevServerExists = fs.existsSync(path.join(projectRoot, 'node_modules', 'webpack-dev-server'));

    if( !webpackExists || !webpackDevServerExists ) {
      console.log();
      console.log(chalk.white('webpack or webpack-dev-server seem to be missing. Have you run ' + chalk.cyan('npm install') + ' or ' + chalk.cyan('yarn') + '?'));
      console.log();
      process.exit(1);
    }

  },

  start: function(webpackConfig, port) {
    var host = process.env.HOST || 'localhost';
    this.setupCompiler(webpackConfig);
    this.runDevServer(webpackConfig, host, port);
  },

  setupCompiler: function(webpackConfig) {

    var self = this;

    var projectRoot = this.cli.reflect.projectRoot();

    var webpack = require(path.resolve(projectRoot, 'node_modules', 'webpack'));

    // 'Compiler' is a low-level interface to Webpack.
    // It lets us listen to some events and provide our own custom messages.
    this.compiler = webpack(webpackConfig);

    // 'invalid' event fires when you have changed a file, and Webpack is
    // recompiling a bundle. WebpackDevServer takes care to pause serving the
    // bundle, so if you refresh, it'll wait instead of serving the old one.
    // 'invalid' is short for 'bundle invalidated', it doesn't imply any errors.
    this.compiler.plugin('invalid', function() {
      self.spinner.stop();
      clearConsole();
      self.spinner.start();
      self.spinner.text = chalk.cyan('Compiling...');
    });

    // 'done' event fires when Webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    this.compiler.plugin('done', function(stats) {
      self.spinner.stop();
      clearConsole();

      // TODO: perhaps show the chunks compiled, at least on the first run.

      // We have switched off the default Webpack output in WebpackDevServer
      // options so we are going to 'massage' the warnings and errors and present
      // them in a readable focused way.
      var messages = formatWebpackMessages(stats.toJson({}, true));
      if (!messages.errors.length && !messages.warnings.length) {
        console.log(chalk.green('Compiled successfully!'));
        console.log();
        console.log('Note that the development build is not optimized.');
        console.log('To create a production build, use ' + chalk.cyan('ng6 build') + ' or ' + chalk.cyan('npm run build') + '.');
        console.log();
        console.log('Starting BrowserSync...');
        console.log();
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        console.log(chalk.red('Failed to compile.'));
        console.log();
        messages.errors.forEach(function(message) {
          console.log(message);
          console.log();
        });
        return;
      }

      // Show warnings if no errors were found.
      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.'));
        console.log();
        messages.warnings.forEach(function(message) {
          console.log(message);
          console.log();
        });

        // Teach some ESLint tricks.
        console.log('You may use special comments to disable some warnings.');
        console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
        console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
      }
    });


  },

  runDevServer: function(webpackConfig, host, port) {

    var self = this;

    var WebpackDevServer = require(path.resolve(this.cli.reflect.projectRoot(), 'node_modules', 'webpack-dev-server'));

    var devServer = new WebpackDevServer(this.compiler, {
      // Enable gzip compression of generated files.
      compress: true,
      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: 'none',
      // It is important to tell WebpackDevServer to use the same 'root' path
      // as we specified in the config. In development, we always serve from /.
      publicPath: webpackConfig.output.publicPath,
      // WebpackDevServer is noisy by default so we emit custom message instead
      // by listening to the compiler events with `compiler.plugin` calls above.
      quiet: true,
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/
      },
      host: host,
      historyApiFallback: true,
    });


    // Launch WebpackDevServer.
    devServer.listen(port, function(err) {
      if (err) {
        return console.log(err);
      }

      clearConsole();

      console.log();
      self.spinner.start();
      self.spinner.text = chalk.cyan('Starting the development server...');

    });
  },

  getWebpackConfig: function(projectRoot) {
    var webpackConfigPath = '';

    var webpackDev = path.resolve(projectRoot + '/webpack.dev.config.js');
    var webpackDevBabel = path.resolve(projectRoot + '/webpack.dev.config.babel.js');
    var webpackRoot = path.resolve(projectRoot + '/webpack.config.js');
    var webpackRootBabel = path.resolve(projectRoot + '/webpack.config.babel.js');

    if( fs.existsSync(webpackDev) ) {
      webpackConfigPath = webpackDev;
    } else if( fs.existsSync(webpackDevBabel) ) {
      webpackConfigPath = webpackDevBabel;
    } else if( fs.existsSync(webpackRoot) ) {
      webpackConfigPath = webpackRoot;
    } else if( fs.existsSync(webpackRootBabel) ) {
      webpackConfigPath = webpackRootBabel;
    }

    if( this.cli.isEnabled('config') ) {
      webpackConfigPath = path.resolve(projectRoot, this.cli.request.getOption('config'));
    }

    if(!webpackConfigPath) {
      console.log();

      if( this.cli.isEnabled('config') ) {
        console.log(chalk.white('You specified a webpack config file at ' + chalk.yellow(webpackConfigPath) + ' but I was unable to find one ther.'));
      } else {
        console.log(chalk.white('Cannot find webpack.config looked at '
          + '\n\t' + chalk.yellow(webpackDev)
          + '\n\t' + chalk.yellow(webpackDevBabel)
          + '\n\t' + chalk.yellow(webpackRoot)
          + '\n\t' + chalk.yellow(webpackRoot)
        ));
      }
      console.log();
      process.exit(1);
    } else {
      console.log();
      console.log(chalk.white('using webpack config found at ' + chalk.green(webpackConfigPath)));
      console.log();
    }

    var webpackConfig = require(webpackConfigPath);

    if( _.isFunction(webpackConfig) ) {
      return webpackConfig({ dev: true }); // --env.dev
    }

    return webpackConfig;

  },

  run: function() {

    var self = this;

    this.spinner = Ora().start(); // This initializes the spinner and attaches it to this so that other functions can use it.
    this.spinner.stop(); // It is immediately stopped because it will be started in an async callback.

    this.checkProject();

    if( this.cli.isEnabled('p') ) {
      DEFAULT_PORT = this.cli.request.getOption('p');
    }

    // --port is prioritized higher than -p
    if( this.cli.isEnabled('port') ) {
      DEFAULT_PORT = this.cli.request.getOption('port');
    }

    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `detect()` Promise resolves to the next free port.
    detect(DEFAULT_PORT).then(function(port) {

      process.env.PORT = port;

      // need to require the webpack file after setting process.env.PORT
      var webpackConfig = self.getWebpackConfig(self.cli.reflect.projectRoot());

      self.start(webpackConfig, port);

    }).catch(function(err) {
      console.log(err);
    });

  }

});
