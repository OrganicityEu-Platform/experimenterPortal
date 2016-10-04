# Urban Data Observatory

This is the Urban Data Observatory front-end. A tool for exploring data and imagine future experiments using the Organicity EaaS platform. This works together with the [Organicity APIs](http://organicityeu.github.io/api/).

This tool is based on the [SmartCitizen](http://smartcitizen.me) front-end framework.


### Prerequisites

You need git to clone the repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test the Web App. You must have node.js and
its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

Also gulp: `npm install -g gulp` (with `sudo` if you are using Mac).

### Clone the project

Clone the repository using:

```
git clone https://github.com/OrganicityEu/UrbanDataObservatory.git
cd UrbanDataObservatory
```

### Install dependencies
* Install tools to manage and test the application: `npm install.`
* No need of `bower install`, `npm install` will take care of it.

### Use Gulp tasks

* `gulp` or `gulp build` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp test` to launch your unit tests with Karma
* `gulp test:auto` to launch your unit tests with Karma in watch mode
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

Note: in case you see something like:
> Error: Command failed: fatal: unable to read c6a8d370f3e95d9110eca4a03b704bd8940ca40b

Run:
`rm -Rf $(node -e "console.log(require('path').join(require('os').tmpdir(), 'tmpRepo'))")`

### Directory structure

[Best Practice Recommendations for Angular App Structure](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

### Git Commit Guidelines
Visit https://github.com/ajoslin/conventional-changelog/blob/master/CONVENTIONS.md


### Naming conventions for files
Same for all types of components:
<Name of component camelcased>.<Type of module>.js
Ex: resources.controller.js, sensor.service.js, profileTools.constant.js


### Naming conventions for components
Controller: <Name of controller capitalized>Controller. Ex: MapController
Service: <Name of service camelcased>. Ex: device, kit, user 
Constructor: <Name of constructor capitalized>. Ex: User, Kit. Note: Constructors are actually made using services.
Constants: <Name of constant uppercase joined by an underscore>. Ex: PROFILE_TOOLS

For data that has been resolved from the router, I've normally appended 'Data' to the name.

### Deployment

* **Staging:**  Do `cap staging deploy` and select the branch you want to deploy at http://staging.organicity.smartcitizen.me/
* **Production:** Do `cap production deploy` to deploy the `master` branch at http://organicity.smartcitizen.me/
