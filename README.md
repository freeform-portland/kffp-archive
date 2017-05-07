# Freeform Portland Archive Application

### Development Environment Using Docker
First, install [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)

Next, clone the repository
```
$ git clone git@github.com:marciaga/kffp-archive.git
```

You'll also need a `.env` file, whose values you can obtain from another developer on the project. An example `.env.example` is in the project directory, so you can
```
$ cp .env.example .env
```
then fill in the values.

Next, run:
```
$ RELEVANT DOCKER CMD
```
This command will build the images, install the dependencies, and start the application.


## Tests
We use the `Ava` testing framework.
To run the tests, use:
```
$ yarn test
```

## Code Style
We use ESLint to ensure style consistency:
```
$ yarn lint
```

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
