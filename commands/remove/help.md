The remove command enables you to remove a component hierarchy, and will also clean up it's module references in it's parents component.module.js file. This will work on most artifacts.

Usage: **<%= cli.bin %> remove** *[name]*

Examples:

Called from root:
```shell
<%= cli.bin %> new component example
cd components/
<%= cli.bin %> remove example
```
or
```shell
<%= cli.bin %> new component example
<%= cli.bin %> remove components
```