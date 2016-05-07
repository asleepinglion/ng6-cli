# Component Architecture

In its simplest form **`ng6`** is the combination of the new [angular.component](https://docs.angularjs.org/guide/component) method and ES6 Modules.

Components have been entirely isolated from the host application and the build system. This allows one application to consume another's components. This also allows us to make migrations to future versions easier. It also enables consumers of the architecture to modify the host application or build system independent of the components. 

In the current templates, we use [Webpack](https://webpack.github.io/) to build the application and ES6 is made available via Babel.

> **Hint:** It would be easy to use something like [browserify](https://github.com/systemjs/systemjs) or [rollup](https://github.com/rollup/rollup) instead -- the only requirement is that modules should be processed using a build system that supports CommonJS modules. We would love to see application templates created for these bundlers and are currently playing with a version that uses SystemJS.

**For mobile applications,** we take advantage of the same achitecture, however we also import the [Ionic](http://ionicframework.com/) bundle into the main `app.module.js` entry point. 

## Application Structure

This project contains an `app` folder which houses the host application separately from the components. The main `webpack` configuraiton is located at the project root and describes how the application is built. The `app/app.module.js` is the main entry for the application, the one`webpack` uses to start the build.

```js
app
../package.json //npm package definition
../webpack.config.js //webpack configuration
../build // distributable build 
../app //isolated host application
../../app.module.js //main entry point
../../app.component.js //root component
../../app.component.html 
../../index.html //template for the HtmlWebpackPlugin
../components // host application components
```


## Why this architecture?

For large-scale applications worked on by multiple teams, its imortant that teams can work autonomously within their own sandbox while still continuously delivering their  modules & compoments to a deployed application. To make this possible, the architecture combines the component pattern, es6 modules, & webpack. 

One of the key aspects to the component driven architecture is the idea that the app itself is a component. The screens you create and the elements that make them up are all components as well.  This predictable approach to front end application development, based on industry-proven best practices, enables us to significantly decrease development costs through reuse, modularity, and composability. 

Combining consistent conventions with commonjs/es6 module imports, we are empowered to iterate rapidly, to experiment, and to share independently versioned components across products & platforms. 

## Built with Webpack

[Webpack](https://webpack.github.io/) serves as the build system, enabling us to use ES6 throughout the application, enabling sass, html, and other assets to be included with their component modules, and enabling the efficient bundling of the final code for distribution.

Using Webpack's `require.ensure` in the UI states described in the UI router we can trigger webpack to chunk our final code for distibution, optimized for the best end user experience with the least amount of connections and initial load time.

# Best Practices

- Applications should be entirely composed of components, starting with an app component at the root. 
- All components should be namespaced with the proper product/project prefix. 
- All module and component names should reflect the directory structure relative to the root.
- Prefer verbose names with a more explicit implication for the component's singular purpose.
- Prefer the creation of multiple components over a single component with many features. Monolithic components are hard to test & maintain :(
- Smart components act as containers to other components; they inject services and provide context to the components within them. They can consume other smart components as well as dumb components. They can have their own bindings for data, configuration, or event hooks.
- Dumb components are pure and do not care about where there data comes from, only what data they need, the options to configure them, and hooks for any events they fire. They can consume other dumb components.
- Services should usually be stored within the services folder of the component that injects them. 
- If a service is used by multiple components, it should be stored in the parent smart component services folder.
- If the service can truly be used by all components, it should be placed in the applications root services folder. 
- Just like the components, service names should be namespaced and reflect their directory structures.

# More Information
For more information on the component pattern and additional resources
please check the following links:


- [Angular ES6 Style Guide](https://github.com/rwwagner90/angular-styleguide-es6#modularity)
- [Exploring the Angular 1.5 .component() method](https://toddmotto.com/exploring-the-angular-1-5-component-method/)
- [Component Pattern](https://github.com/tomastrajan/component-pattern-for-angular-js-1-x)
- [How to design large AngularJS applications that scale – Sebastian Fröstl and Gernot Höflechner](https://www.youtube.com/watch?v=eel3mV0alEc)
- [How Instagram.com Works - Pete Hunt](https://www.youtube.com/watch?v=VkTCL6Nqm6Y)