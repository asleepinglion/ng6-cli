# Application Scaffolding

Creating a new application is the first step when using the **`ng6`** cli. You can either create a new application within the current directory by passing a dot ('.') for the application name, or a new folder by passing in something else for the name.

A new project will be created with the basic application configuration. This includes a webpack configuration the host application component and index.html template. You can then use **`ng6 new`** to scaffold additional artifacts, such as components, filters, & services. When creating these additional artifacts the reflection and refactorization libraries are used to setup the proper import statements, angular dependencies, and angular definitions necessary to wire up the application.


## General Usage:

```shell
ng6 new [type:template] [component-name] [options]
```

## Creating New Applications:

To create a new application using the default template and install dependencies:
> This will create a new folder within the current working directory.

```shell
ng6 new app [app-name] --install
```

To create a new application using the mobile template and install dependencies:
> This will create a new folder within the current working directory.

```shell
ng6 new app:mobile [app-name] -i
```

## Creating New Libraries:

To create a new library using the default template and install dependencies:
> This will create a new folder within the current working directory.

```shell
ng6 new library [library-name]
```

## Creating New Components:

To create a new view component (a component which contains a ui-router state):
> You will probably need to modify the ui-router state's url as it will default to the name of the component.

```shell
ng6 new component [component-name] -v
```

To create a regular component:

```shell
ng6 new component [component-name]
```

To create a component with more fine grained control, you can use the directive type:

```shell
ng6 new component [component-name] -d
```

To see a list of available templates for generation organized by type:

```shell
ng6 list templates
```

## Create A New Module:

```shell
ng6 new module [module-name]
```

## Create A New Service:

```shell
ng6 new service [service-name]
```

## Create A New Filter:

```shell
ng6 new filter [filter-name]
```

## Create A New Directive:

```shell
ng6 new directive [directive-name]
```

## Create A New Provider:

```shell
ng6 new provider [provider-name]
```
