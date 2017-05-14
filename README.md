# Freeform Portland Archive Application
[![CircleCI](https://circleci.com/gh/marciaga/kffp-archive.svg?style=svg)](https://circleci.com/gh/marciaga/kffp-archive)

### Install Development Environment Using Vagrant
First, ensure you've installed [Virtual Box](https://www.virtualbox.org/wiki/Downloads) and [Vagrant](https://www.vagrantup.com/)

Next, clone the repository
```
$ git clone git@github.com:marciaga/kffp-archive.git
```

You'll also need a `.env` file, whose values you can obtain from another developer on the project. An example `.env.example` is in the project directory, so you can
```
$ cp .env.example .env
```
then fill in the values.

Next, run from the project root:
```
$ vagrant up --provision
```
This command will provision a vagrant VM with all the necessary system dependencies.

Note: you only need to run `vagrant up --provision` during setup. Subsequent startups will be `vagrant up`
You can power down the VM with
```
$ vagrant halt
```

## Tests
We use the `Ava` testing framework.
To run the tests, use:
```
$ yarn test
```

## Code Style
We use ESLint to ensure style consistency

## Adding New Dependencies
It's important to not use `npm` to add dependencies because they won't be added to the `yarn.lock` file. Instead, to add to `dependencies` use
```
$ yarn add <package>
```
or to add to `devDependencies`, use
```
$ yarn add -D <package>
```

## Git Workflow
We use Gitflow, which you can read about [here](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow)

Feature branches should be named as follows:
```
$ git checkout -b feature/my-feature
```

Pull requests should always be from your feature branch to the develop branch.
