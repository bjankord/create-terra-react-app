#!/usr/bin/env node
const shell = require('shelljs');
const colors = require('colors/safe');
const fs = require('fs');
const templates = require('./templates/templates.js');

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const findAndReplace = (options) => {
  fs.readFile(options.file, 'utf8', (errMsg, data) => {
    if (errMsg) {
      return console.log(errMsg);
    }

    const result = data.replace(options.regex, options.content);

    fs.writeFile(options.file, result, 'utf8', (error) => {
      if (error) {
        console.error(`Error writing content to ${options.file} ${error}\n`);
      } else {
        console.log(`Content written to ${options.file}`);
      }
    });
  });
};

const run = async () => {
  let success = await createReactApp();
  if (!success) {
    console.log(colors.red('Something went wrong while trying to create a new React app using create-react-app'))
    return false;
  }
  await cdIntoNewApp();
  await installPackages();
  await updateTemplates();
  await modifyTemplates();
  await amendGitChanges();
  console.log(colors.green(`All done! 👍

We suggest that you begin by typing:

cd ${appName}
yarn start`));
};

const createReactApp = () => {
  return new Promise(resolve => {
    if (appName) {
      shell.exec(`npx create-react-app ${appName}`, (code) => {
        console.log("Exited with code ", code)
        console.log("Created terra react app")
        resolve(true)
      })
    } else {
      console.log("\nNo app name was provided.".red)
      console.log("\nProvide an app name in the following format: ")
      console.log(colors.cyan("\ncreate-terra-react-app ", "app-name\n"))
      resolve(false)
    }
  });
};

const cdIntoNewApp = () => {
  return new Promise(resolve => {
    shell.cd(appDirectory)
    resolve()
  });
};

const installPackages = () => {
  return new Promise(resolve => {
    console.log(colors.cyan("\nInstalling node-sass, prop-types, terra-aggregate-translations, terra-base, react-intl \n"))
    shell.exec(`yarn add -D node-sass terra-aggregate-translations && yarn add terra-base react-intl@^2.9.0 prop-types@^15.0.0`, () => {
      console.log(colors.green("\nFinished installing packages\n"))
      resolve()
    });
  });
};

const updateTemplates = () => {
  return new Promise(resolve => {
    let promises = [];
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function (err) {
          if (err) { return console.log(err); }
          res();
        });
      });
    });
    Promise.all(promises).then(() => { resolve(); });
  });
};

// TODO - modify .gitignore, package.json, and index.html. Use find/replace on these files instead of full rewrite.
const modifyTemplates = () => {
  return new Promise(resolve => {
    let promises = [];

    // .gitignore modification
    promises[0] = new Promise(res => {
      const regex = /#.misc/g;
      const file = `${appDirectory}/.gitignore`;
      const content = [
        '# terra-ui',
        'aggregated-translations',
        '',
        '# misc',
      ];

      fs.readFile(file, 'utf8', (errMsg, data) => {
        if (errMsg) {
          return console.log(errMsg);
        }

        const result = data.replace(regex, content.join('\n'));

        fs.writeFile(file, result, 'utf8', (error) => {
          if (error) {
            console.error(`Error writing content to ${file} ${error}\n`);
          } else {
            res();
          }
        });
      });
    });

    // public/index.html modification
    promises[1] = new Promise(res => {
      const regex = /\<html.lang="en"\>/g;
      const file = `${appDirectory}/public/index.html`;
      const content = '<html lang="en" dir="ltr">';

      fs.readFile(file, 'utf8', (errMsg, data) => {
        if (errMsg) {
          return console.log(errMsg);
        }

        const result = data.replace(regex, content);

        fs.writeFile(file, result, 'utf8', (error) => {
          if (error) {
            console.error(`Error writing content to ${file} ${error}\n`);
          } else {
            res();
          }
        });
      });
    });

    // package.json modification
    promises[2] = new Promise(res => {
      const regex = /"scripts":.{/g;
      const file = `${appDirectory}/package.json`;
      const content = `"scripts": {
    "aggregate-translations": "tt-aggregate-translations -b ./ -d ./src/**/translations -d ./translations -o ./node_modules/terra-i18n/node_modules -f es6",
    "prestart": "npm run aggregate-translations",`;

      fs.readFile(file, 'utf8', (errMsg, data) => {
        if (errMsg) {
          return console.log(errMsg);
        }

        const result = data.replace(regex, content);

        fs.writeFile(file, result, 'utf8', (error) => {
          if (error) {
            console.error(`Error writing content to ${file} ${error}\n`);
          } else {
            res();
          }
        });
      });
    });

    Promise.all(promises).then(() => { resolve(); });
  });
};

const amendGitChanges = () => {
  return new Promise(resolve => {
    shell.exec(`git add . && git commit --amend --no-edit`, () => {
      resolve();
    });
  });
};

run();
