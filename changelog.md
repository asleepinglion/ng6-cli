# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and
the following changelog guidelines: http://keepachangelog.com/

## [Unreleased]

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