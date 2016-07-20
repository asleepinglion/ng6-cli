Scaffolding lets us glue together the pieces of our applications quickly
and consistently.

Usage: **<%= cli.bin %> new** *[type:template]* *[name]* *[options]*

Options:

  *-t,--template*       *....* Specify which template to use.

Component Options:

  *-v,--view*           *....* Create a view component (a screen routed by the url).
  *-d,--directive*      *....* Directive based component (only works with components).
  *-c, --cssModules*    *....* Enable or disable css modules (enabled by default).

To see a list of available templates you can execute the
following command: **<%= cli.bin %> list templates**