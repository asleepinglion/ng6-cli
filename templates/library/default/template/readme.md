# <%= name %> component library





##Getting Started

The easiest way to get started is by using the [ng6-cli](https://github.com/UltimateSoftware/ng6-cli) to develop, test, and build Angular applications with the **ng6** components.  

However, as long as your using Angular 1.5+, NPM, and a build system that supports CommonJS modules (like Webpack, Browserify, or SystemJS) you should be able to easily consume the components into your application.

**Import & Add Angular Dependency:**

Once the components are installed into your project, you just need to import them and their styles, and add them as a dependency to your Angular application:

> Note: other imports have been removed in this excerpt for clarity.

```js
import <%= name %>Styles from '<%= name %>/styles/<%= name %>.scss';
import <%= name %>Components from '<%= name %>/components/components.module';

angular.module('app', [
  <%= name %>Components
])
```

**Consuming the Styles w/o Angular Components:**

The component's styles are also extracted from each component and stored in an isolated stylesheet: `build/css/<%= name %>.css` for easy consumption.

## Component Structure

The components in this repository are dumb presentational components that bake-in styles and provide a simple declarative interface for specifying data, options, and event hooks. They are built using modern best practices including ES6, Module Imports, and the Angular Component Pattern (see [angular.component](https://docs.angularjs.org/guide/component)).

Some components are more complex then others of course, but the following describes the folders and files you might see in a component:

```js
my-component

../package.json // component's package definition
../readme.md // component's documentation

../my-component.module.js // component module file
../my-component.component.js // component definition
../my-component.component.test.js // component test file
../my-component.component.html // component template
../my-component.scss // component styles

../components // nested components
../../sub-component1 // sub component with same nested structure
../../my-component.components.module.js // module to group sub-components

../services // nested services
../../service1 // an angular service
../../my-component.services.module.js // module to group services

../filters // nested filters
../../filter1 // an angular filter
../../my-component.filters.module.js // module to group filters

../directives // nested directives
../../directive1 // an angular directive (attribute or element)
../../my-component.directives.module.js // module to group directives

```


## More Information
For more information on the component pattern and other additional resources
please check the following links:

- [Angular Component](https://docs.angularjs.org/guide/component)
- [Angular NG6 Starter](https://github.com/AngularClass/NG6-starter)
- [Angular ES6 Style Guide](https://github.com/rwwagner90/angular-styleguide-es6#modularity)
- [Exploring the Angular 1.5 .component() method](https://toddmotto.com/exploring-the-angular-1-5-component-method/)
- [Component Pattern](https://github.com/tomastrajan/component-pattern-for-angular-js-1-x)
- [How to design large AngularJS applications that scale – Sebastian Fröstl and Gernot Höflechner](https://www.youtube.com/watch?v=eel3mV0alEc)
- [How Instagram.com Works - Pete Hunt](https://www.youtube.com/watch?v=VkTCL6Nqm6Y)
