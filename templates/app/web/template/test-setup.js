require('babel-register')({
  extends: './.babelrc',
  plugins: [ 'transform-es2015-modules-commonjs' ], // This is needed because webpack does not transpile modules, so it can code-split
});
