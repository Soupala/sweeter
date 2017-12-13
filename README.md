# Sweeter beta
CLI tool for concurrent JavaScript package development. Currently in BETA. Use at your own risk.

## Requirements
- NodeJS
- NPM
- Each package must have a valid NPM package.json file with a package name in it.

## Install and Setup
```sh
$ npm install -g sweeter
$ sweeter init
```

## How It Works
The core of Sweeter is saving and persisting information about local JavaScript codebases (aka "NPM packages"). How? By saving information into templates in the ~/.sweeter/templates directory. The template structure enables you to build and share complex local development configurations with your teammates and to quickly switch context if you're working on multiple projects.

Start by connecting the packages you are working on. Commonly these codebases each have their own repository, but Sweeter can also connect to packages in a monorepo. Go to the top level directory of each of the packages you would like to connect to the current template. Make sure there is a valid NPM package.json file. Then, run:
```sh
$ cd path/to/your/package && sweeter connect
```

Once Sweeter has a template with local paths to your codebases, run the help command.
```sh
$ sweeter -h
```

Running the help command will return a list of additional commands.

Once Sweeter has the basic information (package locations and their local dependencies) stored in Sweeter templates, it becomes trivial to leverage the power of these templates to meet the needs of your own workflows. Templates are just JSON configuration files in the ~/.sweeter/templates directory. Be sure to open up those files to see how they work. The `~/.sweeter/config.json` file can also be edited manually to switch the current template.

Additionally, some Sweeter commands will generate shell scripts in the ~/.sweeter/.tmp folder in order to execute actions synchronously. Both `sweeter exec <command(string)>` and `sweeter exec link-dependencies` currently generate file in the .tmp directory.  The name of the file will be in universal time format like: `.sweeter/.tmp/2017-11-21-30-30.sh` (which makes it easy to find the most recent). To find the most recent generated file, go to the file at the bottom of the list.

## Commands
**sweeter init**

The init command generates the ~/.sweeter/config and ~/.sweeter/templates/default.json files needed to get started.

**sweeter connect**

The connect command should be executed from the top level directory of a package. Sweeter will save the local file path for this package into the currently loaded template.


**sweeter save-local-dependency <dependency> [moreDependencies...]**

The save-local-dependency command should be executed from the top level directory of a package. Sweeter will save the supplied dependency names into the currently loaded template. Other commands will leverage this information to symlink interdependent packages together.  The dependency names must be exactly the same as appears in the dependency's package.json. For example, if the package includes an organizational namespace `@mycompany/my-package`, the dependency must match exactly.

**sweeter remove-local-dependency <dependency> [moreDependencies...]**

The remove-local-dependency command should be executed from the top level directory of a package. Sweeter will remove the supplied dependency names for that package in the currently loaded template. The dependency names being removed must be exactly the same as appears in the template. Alternatively, it may be faster to edit the template file directly.

**sweeter save-order <number>**

The supplied value must be numeric. Saves or updates the `order` property to current template for package in the current working directory. This property can be used by other scripts and commands to build and test packages synchronously in the correct order. In the future, it would be ideal to develop an algorithm for calculating build order automatically.

**sweeter off**

The supplied value must be numeric. Saves or updates the `order` property to current template for package in the current working directory. This property can be used by other scripts and commands to build and test packages in the synchronously in the correct order. In the future, it would be ideal to develop an algorithm for calculating build order automatically.

**sweeter switch <template-file(string)>**

The switch command allows the user to switch templates. The template filename must be a file in the `~/.sweeter/templates` directory. The expected format is `my-template-name.json`.  The object in the file must be a valid JSON object. Typically, a user will copy their default.json config file and tweak and/or receive a template from someone else on their team to start from.

**sweeter exec <command(string)>**

The execute command loops through each package and runs the supplied command string. This is flexible and handy for actions like running `npm install` on all of the packages in the template, or removing node_modules and reinstalling all the packages.

**sweeter update-version-all <version(string)>**

The update-version-all command allows the user to update the version in all connected packages to the user supplied string. If a package is listed as a dependency, peerDependency, and/or devDependency of any other packages in the template file, those will be updated as well. The string must adhere to the rules of NPM package versioning. Currently, this string is not validated by Sweeter, however the plan is to implement validation at some point.

**sweeter remove-lockfiles-all**

The remove-lockfiles-all command removes both package-lock.json and npm-shrinkwrap.json files in all of the packages of the currently loaded template. This is useful in local development because anytime a package version or dependency is changed, the lockfile(s) may get out of sync and have to be regenerated prior to committing changes. To regenerate fresher lockfiles, run `sweeter exec npm install`.

**sweeter off**

Turns off a package in the current template; run the command from the top level directory of that package. All of the relevant Sweeter commands will then skip over this package.

**sweeter off**
Turns on a package in the current template; run the command from the top level directory of that package.

**sweeter link-dependencies**
The link-dependencies command loops through all of the connected packages in the currently loaded template and runs `npm link`. Additionally, the command loops through all of the local dependencies defined in the currently loaded template for each package and executes `npm link name-of-package`.

**Other Commands**

Many additional features are on the drawing board. Run `sweeter -h` and look for the commands with `[NOT AVAILABLE YET]` too see the kinds of commands we're thinking about.

## Extending Sweeter
There are currently two options for extending Sweeter.

But before we dive into those, evaluate if some of your packages consume each other. Currently, the way to assign the order in which packages need to be built and tested (assuming there is a food chain relationship between your different packages), edit the `order` property for each package in the current template json file. For convenience, there is also a `sweeter save-order <value>` command  (run it from the top level of a specific package). For packages needing to be built first, assign them a `0` value (this is the default value). For packages that depend on the `0` order packages to be built, assign them `1` value.  For packages that depend on `0` and/or `1` order packages, assign them a `2` order, and so on.

The `sweeter exec <command(string)` is flexible in that you can create one or more shell or node scripts in each package with the same name or path/to/name across the packages.  Under the hood, each script could apply the custom/unique commands needed to test / build that particular package.

Then, you can execute an command that loops through all the packages. For example, suppose you've standardized on `npm run build` for all of your internal packages. The following would loop through and execute `npm run build` for each of your packages: `sweeter exec npm run build`.

Another option is to write scripts to directly parse the json templates in the ./sweeter/templates directory. This approach is also flexible and provides a way to check all your custom scripts into version control in one place, as well as sharing those custom scripts with your team. However, it is somewhat less future-proof.  We expect minor changes to the Sweeter template JSON properties as new features are added and feedback is received from the community.

## TODOs
- Tests. Lots of tests.
- Feature roadmap.
- Publish to Github with Apache 2.0 license.
- Guide for contributors and pull requests.
- Custom commands / extensions / plugin architecture.


## Why Sweeter?
The user story begins with a software engineer named Ada working in a web of modular JavaScript architecture. Her current assignment is to implement a new feature. In order to implement this feature, she will have to make changes across 4+ JavaScript packages.

Ada is working with these four packages on her local machine: Package A, Package B, Package C, and Package D. Package A is an open source package Ada has forked. She is contributing improvements to Package A because Package B needs those changes to proceed. Package B is an in-house library where Ada is adding code needed by both Package C and D. Package C is some kind of backend service. Package D could be any kind of consumer application such as a webapp, a mobile app, or an Electron app.  

Ada has to link all of these packages together in her development environment. She checks out a new branch from the development trunk called "new-feature". After making the changes to Package A, she wants to propagate the changes immediately to Package B while she waits for the code reviewer to accept her pull requests (because she doesn't want to incur the cost of having the CI team to add it to the build pipeline and then constantly keep her fork updated). She'll then write tests and more code utilizing the changes she made in Package A. She'll then want to immediately propagate changes down to Package C and Package D before pushing her work up to the remote repositories. Then, she'll want to rebuild each of those packages and run her tests locally. Of course, Ada will have to "rinse and repeat" several more times as she fixes bugs, addresses ambiguity in the spec, and gets the feature close to a state where it can be folded into the main development trunk.

At last, Ada is ready commit her changes to the remote branches for each repository. She starts at the top of her internal dependency chain by committing her changes for Package B (her pull requests to Package A were accepted and published to NPM after passing CI). She then waits until Package B gets through her company's internal Continuous Integration (CI) pipeline and published to NPM or equivalent artifact library. Then she can start the same process for Package C, and then finally Package D.

The story repeats itself, except with more packages, more complexity, and more engineers to coordinate with. Every time she deletes the /node_modules folder in a package she is working on, Ada has to remember to re-symlink to the upstream local packages. When she's finally ready to start pushing changes to CI, she'll have to manually open each package.json file of each relevant downstream package and update both the dependencies and the version of itself, which triggers yet another ripple of changes downstream. Then, in the middle of all this, the team updates their version of NodeJS and NPM for the latest security patches. Consequently, she has to re-install all of her global dependencies, nuke all of her node_modules, and redo all of the symlinks she had created in each package she is working on.

This tool addresses some the major point points in Ada's work and increases her productivity. As a result, her stress level declines. She also makes timely contributions to open source projects benefiting both her company and the open source community. She spends a greater percentage of her time engineering solutions for customers and chilling with her co-workers. Her life is getting Sweeter.
