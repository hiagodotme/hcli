#!/usr/bin/env node
var npm = require('npm'),
    chalk = require('chalk'),
    package = require('./package.json'),
    clear = require('clear'),
    figlet = require('figlet');
// protected packages
var protected = [
    'npm',
    'chalk',
    'clear',
    'figlet'
];


var showPresentation = function () {
    clear();
console.log(
    chalk.bold.blue(
        figlet.textSync('HC', { font: 'block' })
    ),
    chalk.yellow(
        figlet.textSync('LI', { font: 'block' })
    )
);

console.log(
    chalk.bold.blue("Author: ") + chalk.yellow("Hiago Silva Souza (https://www.hiago.me)")
);
console.log(
    chalk.bold.green("Version: ") + chalk.blue(package.version)
);
};

/**
 * Show helper to hcli
 */
var showHelper = function () {
    showPresentation();
    console.log(`Commands available:`);
    console.log(`\t-i package-name: install new command.`);
    console.log(`\t-r packageName(...args): run the installed command.`);
    console.log(`\t-l: list all commands installed.`);
    console.log(`\t-u package-name: remove command.`);
};

// process
cmd = process.argv[2];
if (protected.indexOf(process.argv[3]) > -1) return handlError('Protected package detected, aborting!');

switch (cmd) {
    case null:
    case undefined:
        return showHelper();
    case '-l':
        var installedPackages = 0;
        Object.keys(package.dependencies).forEach(function (key) {
            if(protected.indexOf(key) === -1) {
                installedPackages++;
            }
        });
        showPresentation();
        console.log('You have '+installedPackages+' package(s) installed!:');
        Object.keys(package.dependencies).forEach(function (key) {
            if(protected.indexOf(key) === -1) {
                console.log(chalk.green(key) + '@' + chalk.yellow(package.dependencies[key]));
            }
        });
        break;
    case '-r':
        var cmdCopy = process.argv.slice(3).join(' ');
        var libName = cmdCopy.split("(")[0];
        var posCommand = cmdCopy.split(libName)[1];
        eval('console.log(require("' + libName + '")' + posCommand + ');');
        break;
    case '-i':
        npm.load(function (err) {
            if (err) return handlError(err);
            npm.commands.install([process.argv[3]], function (er, data) {
                if (er) return commandFailed(er)
                // command succeeded, and data might have some info
                console.log(`${process.argv[3]} installed!`);
            });
        });
        break;
    case '-u':
        npm.load(function (err) {
            if (err) return handlError(err);
            npm.commands.remove([process.argv[3]], function (er, data) {
                if (er) return commandFailed(er)
                // command succeeded, and data might have some info
                console.log(`${process.argv[3]} removed!`);
            });
        });
        break;
    default:
        console.log(`Não encontramos nenhum comando com o nome ${cmd}`);
        break;
}

