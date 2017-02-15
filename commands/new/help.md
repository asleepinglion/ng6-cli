Scaffolding with **<%= cli.bin %> new** command lets us glue together the pieces of our 
applications quickly and consistently. The command can be used to create new 
applications as well as other artifacts such as components & services. 

You should use the list command get a list of all available 
types and templates: **<%= cli.bin %> list**.

Usage: **<%= cli.bin %> new** *[type:template]* *[name]* *[options]*

Options:

  -t,--template *.............* Specify which template to use (instead of :notation).
  -v,--view *.................* Create a view component (a screen routed by the url).
  -d,--directive *............* Directive based component instead of angular.component.
  --cssModules *..............* Enable or disable css modules (<% if( cli.config.options.cssModules ) { %>enabled<% } else { %>disabled<% } %> by default).