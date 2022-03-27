const inquirer = require('inquirer');
const fs = require('fs')
const fetch = require('node-fetch');

const getLicenses = async (license) => {
    // if the function param isn't specified search for all licenses
    // else search for the license specified
    let append = license == undefined ? "" : `/${license}`
    // API Docs: https://docs.github.com/en/rest/reference/licenses
    return fetch("https://api.github.com/licenses" + append)
        .then(response => response.text())
        .then(text => JSON.parse(text))
}

const prompt = async () => {
    let licenses = await getLicenses()
    let response = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter your projects title: ',
            name: 'title',
        },
        {
            type: 'input',
            message: 'Please enter a description of your project: ',
            name: 'description',
        },
        {
            type: 'input',
            message: 'Please enter your projects installation instructions: ',
            name: 'installation',
        },
        {
            type: 'input',
            message: 'Please enter usage information for your project: ',
            name: 'usageInformation',
        },
        {
            type: 'input',
            message: 'Please enter contributors guidelines: ',
            name: 'contributors',
        },
        {
            type: 'input',
            message: 'Please enter any test instructions:: ',
            name: 'test',
        },
        {
            type: 'input',
            message: 'Please enter your GitHub username: ',
            name: 'github',
        },

        {
            type: 'input',
            message: 'Please enter your email address: ',
            name: 'email',
        },
        {
            type: 'list',
            name: 'license',
            message: 'Please enter your license for this project: ',
            //Convert array of objects into array of strings, then sort alphabetically
            choices: licenses.map(i => i.name).sort((a, b) => a.localeCompare(b))
        },
    ])
    // Get the license details for the specific license the user chose.
    response.license = await getLicenses(licenses.filter(i => i.name == response.license)[0].key)
    
    fs.writeFileSync('README-app.md', insertValues(response))
}

const insertValues = (input) => {
    return `
[![License](https://img.shields.io/badge/License-${encodeURIComponent(input.license.name)}-Green)](${input.license.html_url})
# ${input.title}
## Description
${input.description}

## Table of Contents:

- [Description](#description)
- [Installation](#installation)
- [Usage Information](#usage-information)
- [Contribution Guidelines](#contributors) 
- [Test Instructions](#test-instructions)
- [Questions](#questions)



## Installation
${input.installation}

## Usage Information
${input.usageInformation}

## License
This project is licensed with [${input.license.name}](${input.license.html_url}). ${input.license.description}

## Contributors
${input.contributors}

## Test Instructions
${input.test}

## Questions

 - How can I reach the projects owner. 
Maintainer Github: [${input.github}](https://github.com/${input.github})
Email: [${input.email}](mailto:${input.email})
`
}

prompt()
