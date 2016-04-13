# Components

> **Remember:** Components do not have to emit DOM; they can also act as containers.

This folder should contain all your components (except the app component). Keep in mind
components can represent entire screen or simple design patterns. Starting
 with the app as the root component you should make sure break your
 app up into as many singularly responsible components as possible.

Components that do not care about where there data comes from and only about the data they need,
are considered dumb components. Components that inject services and provide context to dumb
components are called smart components.

For example a dashboard component would be a smart component because
it knows about and injects certain services and provides context
to the components it contains, which can be either smart or dumb.

A list item or a button would be examples of dumb components. They should
have bindings for specific data they need and any options that control
their configuration, including any hooks for events they fire.

For more information on smart and dumb components check out the following links:

[How to design large AngularJS applications that scale – Sebastian Fröstl and Gernot Höflechner](https://youtu.be/eel3mV0alEc)

[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.4upzxmivp)