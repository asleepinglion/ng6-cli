# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and
the following changelog guidelines: http://keepachangelog.com/

## [Unreleased]

## [0.5.2] - 2016-07-19

### Changed
- cssModules can now be enabled when creating new components, regardless of project or cli default.
- Request options defaults can be set at project or cli via .ng6-cli (or custom) file.

## [0.5.1] - 2016-07-19

### Added
- Added support for template options, paving the way to converge the multiple named templates.
- Added additional checks on serve to make sure npm install has been run already.
- Added support for EJS templates to command help -- with configuration & request information as the context.

### Changed
- Converged multiple named templates into single templates with options, e.g. a simple directive option instead of a complete copy of the component template.
- Updated dependency versions in template package.jsons.

## [0.4.25] - 2016-07-01

### Changed
- The ng6-cli is now an official project of Ultimate Software's open source initiatives using the Apache 2 license.

## [0.4.24] - 2016-06-17

### Fixed
- Fixed bug with use of camelCase names for files in templates, should be kebab case.

## [0.4.23] - 2016-06-16

### Changed
- Updated edge templates to use specific suffix (.module.scss) for enabling css modules on sass files. This means you can have both global and local css in your application, and you can migrate to encapsulated css approach one component at a time.

## [0.4.22] - 2016-06-15

### Changed
- Added webpack validator library to do basic validation of the webpack configuration before build & serve.

## [0.4.21] - 2016-06-15

### Fixed

- Fixed issues caused by merging prod/dev webpack configurations onto root configuration. Now dev/prod import and modify the root config themselves.
- Path names are now forced to be kebab-case as intended.

## [0.4.20] - 2016-06-06

### Fixed

- Fixed name given to new project when created within the current directory.

## [0.4.19] - 2016-06-03

### Added

- Updated build & serve commands to support dev/prod configurations. If a dev/prod configuration exists it will be deep-merged on top of the root webpack configuration when running the serve or build commands.

## [0.4.18] - 2016-06-03

### Added
- Added support for template versions and template aliases. This makes it easy to change the default templates used for a type. It also allows us to slowly roll out new versions and test with users before making them official -- or to support old and alternate versions.

### Changed
- The default/mobile templates are now aliases to codenamed templates.
- The .cli-defaults file specifies default template aliases/versions.
- The edge template is the current default with CSS Modules enabled.

## [0.4.17] - 2016-06-01

### Fixed
- Fixed bug (#10) with creating a new app in current directory.

## [0.4.16] - 2016-05-21

### Fixed
- Fixed missing dependency for gulp-batch-replace.

## [0.4.15] - 2016-05-17

### Added
- Added support for replacing specific strings in templates using a replace option and refactored the rename option to be more versatile.
- Added Copy command which can be enabled via user or project level config.
- Added .cli-defaults to hide certain commands behind "feature flags".

### Changed
- Refactored the config system to simplify and enable default configuration settings that come with the CLI.
- Commands can now be enabled or disabled using user or project level configurations.

## [0.4.14] - 2016-05-11

### Changed
- Fixed legacy code in server command for specifying port.

## [0.4.12] - 2016-05-07

### Added
- added missing repository information to the package.json

### Changed
- updated readme to use absolute urls for docs and links.
- changed dependency in default app to bootstrap-sass instead of boostrap.

## [0.4.11] - 2016-05-07

### Changed
- Fixed issue on windows where the script file name was being shown instead of the actual bin command.
- Fixed import path issue on windows, now using hard-code regex as path.sep wasn't returning the the right platform slash via git bash on windows.

## [0.4.10] - 2016-05-01
### Changed
- Fixed missing font type in default app template.

## [0.4.9] - 2016-05-01
### Added
- Added simple provider template.

## [0.4.8] - 2016-05-01
### Changed
- The `new` command will now fail early if the template does not exist.
- The `new` command will now fail early if the destination already exists.

## [0.4.7] - 2016-05-01
### Changed
- Fixed import path issue with windows, must use unix style paths for import statements.

### Added
- It's now possible to extend templates instead of just replacing them. This can be done by setting the extend option the template class.

## [0.4.5] - 2016-05-01

### Added
- It's now possible to extend templates instead of just replacing them. This can be done by setting the extend option the template class.

### Changed
- Compiled styles are now extracted into an app.css instead of being written to multiple style tags in the final html.
- Othere assets are now broken out into appropriate folders like fonts & images.
- There is now a vendor chunk as well as a common chunk; but more modules need to be called out in the vendor chunk.
- The Sass Resource Loader is now used to make sass variables available to all required sass files without the need to manually import them each time.
- Replaced ng-annoate-loader with a patched version to fix an issue that occurs when npm linking modules.

## [0.4.4] - 2016-04-25

### Changed
- Fixed issue with camel casing being overwritten by title case.

## [0.4.3] - 2016-04-25

### Added
- added proper path for new application when using . option
- added title casing option to name for artifact generation

### Changed
- updated build command to show proper stats at the end
- documentation edits...
- removed unnecessary package dependencies from default template template

## [0.4.2] - 2016-04-23

### Changed
- documentation edits...

## [0.4.1] - 2016-04-23

### Changed
- documentation edits...

## [0.4.0] - 2016-04-23

### Added
- added support for loading project level & CWD templates & commands.
- added new templates for directives and creating other templates.

### Changed
- removed reference to ocLazyLoad in the default webpack configurations.
- revised template desciptions.
- revised command order.
- refactored generate & reflect libraries and improved the new command.
- further effort to improve the documentation -- still WIP.

## [0.3.6] - 2016-04-19

### Added
- added the ability to create new apps inside the current directory

## [0.3.5] - 2016-04-17

### Changed
- new modules created for a parent, will not be named using the parent name as a prefix
- import statements now use distinct names

## [0.3.4] - 2016-04-17

### Added
- added better info about what files are being changed when scaffolding

### Changed
- disabled notifications in browsersync config
- moved find functions in refactor library to reflect library
- fixed issue with creating artifacts in a shared module.

## [0.3.3] - 2016-04-13

### Changed
- removed unnecessary style dependency
- add service suffix to services

## [0.3.2] - 2016-04-13

### Changed
- services now use PascalCase names.

### Removed
- removed unnecessary folders from the default app templates.

## [0.3.1] - 2016-04-13

### Changed
- Reflect.findParentModule now defaults to app.module.js


## [0.3.0] - 2016-04-13

### Changed
- Refactored to make extendable and published initial work.