# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Project setup

1. Fork and clone the repo
2. `npm install` or `yarn` to install dependencies
3. `npm link` or `yarn link` to globally link the `ng6` command for development
4. Create a branch for your PR

## Cutting a Beta Release

1. `npm version [premajor, preminor, prepatch]`
2. `npm publish --tag=beta`
3. In order to install `beta` tagged version, use `npm install ng6-cli@beta`

#### References
* [npm version](https://docs.npmjs.com/cli/version)
* [npm dist-tag](https://docs.npmjs.com/cli/dist-tag)

## Help needed

Please checkout the ROADMAP and raise an issue to discuss any of the items in the backlog.

Also, please watch the repo and respond to questions/bug reports/feature requests! Thanks!