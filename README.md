**This project is provided as-is to enable quick set up for creating prototypes using Terra UI components.**

# Getting Started
To get started creating an app, you can use the following npx based command or the yarn create command.

Use [npx command](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) as follows:

```
npx create-terra-react-app my-app
```

Or you can use the [yarn create](https://yarnpkg.com/lang/en/docs/cli/create/) command as follows if you prefer:

```
yarn create terra-react-app my-app
```

Both commands will generate the same output of a create-react-app based app that is set up to use Terra UI components.

## What this package is:

##### A thin wrapper around `create-react-app`
This project is a thin wrapper around Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app) but adds the following common libraries needed for Terra UI components to work:

react-intl
node-sass
terra-aggregate-translations
terra-base

Along with this, it adds npm scripts to generate aggregate-translations whenever the npm `start` script is run, ensures aggregate-translations are included in `.gitignore`, and sets the dir attribute on the HTML element so Terra UI styles work as intended.
