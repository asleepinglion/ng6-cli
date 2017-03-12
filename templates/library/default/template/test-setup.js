/*
  In order to enable tree-shaking for our application we disable babel from compiling the import/export statements
  in our normal .babelrc, but for testing purposes, we want the import/export statements to be compiled because
  mocha does not natively support import/export statments while webpack v2 does.
*/
require('babel-register')({
  extends: './.babelrc',
  plugins: [ 'transform-es2015-modules-commonjs' ],
});
