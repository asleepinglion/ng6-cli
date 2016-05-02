# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and
the following changelog guidelines: http://keepachangelog.com/

## [Unreleased]

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