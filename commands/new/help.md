Scaffolding lets us glue together the pieces of our applications quickly
and consistently.

Usage: **<%= cli.bin %> new** *[type:template]* *[name]* *[options]*

Options:

  *-t,--template*       *....* Specify which template to use.

Component Options:

  *-v,--view*           *....* Create a view component (a screen routed by the url).
  *-d,--directive*      *....* Directive based component instead of angular.component.
  *--cssModules*        *....* Enable or disable css modules (<% if( cli.config.options.cssModules ) { %>enabled<% } else { %>disabled<% } %> by default).

To see a list of available templates you can execute the
following command: **<%= cli.bin %> list templates**