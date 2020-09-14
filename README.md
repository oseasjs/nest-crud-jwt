# NEST CRUD JWT

This project was inspired on Ariel Weinberger course available on Udemy: **NestJS Zero to Hero** - https://www.udemy.com/course/nestjs-zero-to-hero/

NestJS is a Javascript Framework created by [Kamil Myśliwiec](https://kamilmysliwiec.com) and avaliable on [https://nestjs.com](https://nestjs.com/)

## Main Dependencies:

- node
- nest-cli
- yarn
- typescript
- typeorm
- jest
- postgres

## Instalation

```npm install```


## Running the app

``` npm run start:dev ```

``` yarn start:dev ```


## Tests

``` npm run test ```

``` yarn test```

* Some error message on log are expected when run tests, but they are just log of expected errors;

## Implementation

- **Project structure**: _Following MVC Pattern with: Controller, Service, Repository and Entity, grouped by domain folder. Very similar structure of SpringBoot implementation applications;
- **Controler**: Classes used to process request calls (Rest Apis) and ends with suffix: _*.controller.ts_;
- **Service**: Classes uses to process business logic validations and ends with _*.service.ts_;
- **Repository**: Classes uses to keep persistence logic of entities and ends with _*.repository.ts_;
- **Entity**: TypeORM Framework is used to persist entities data in a table on database. Each entity represents a table on database and is being created according **sincronized: true** configuration on _config/typeorm.config.ts_ . All entities classes ends with suffix _*.entity.ts_;
- **Dependence Injection**: The dependences instances are injected in classes constructors (_Controller, Service_);
- **Dto**: Classes used to represent a data received or retrived on request calls (request body or response) and ends with suffix _*.dto.ts_ and are grouped on dto sub-folder;
- **Validation Pipe**: Classes used to validate objects received on requests, end with suffix _*.pipe.ts_ and are grouped on pipes sub-folder;
- **Postgres**: Database used to persist data. Could be initialized using _docker-compose.yml_ file available on root project folder;
- **Promise**: Type used for Assyncronous processing. Used on methods retrieves objects. Used on Service and Repository classes;
- **await**: Expression that indicates that a method will be process assyncronously and the results will be a Promise. Its holds the method process until the called method retrive expected result. Used on Service and Repository classes;
- **async**: Declaration to define a method as asyncronous (AsyncFunction). Used on Service and Repository classes;
- **QueryBuilder**: Strategy to implements database queries using Oriented Object format (ORM), avoiding native sql commands. Used on Repository classes;
- **OAuth (signup, signin)**: Apis used to create a user (singup) and generate a JWT token for existing user after authentication (singin). All classes envolved are grouped on _auth_ folder (controller, service, repository and entity);
- **Password Security**: Implementation strategy over password using: hash, salt and validation, to keep password more secure;
- **JWT**: Strategy to send a access_token to frontend to allow access to apis for logged users. The singin strategy create access_token that should be sended on all header requests as application bearer token. Products APIs are protected and just allows calls with bearer token on header. The JWT Token generate ans sign is in _jwt.strategy.ts_ file;
- **Decorator**: Implementation strategy that allows get user logged from a jwt token and inject it on apis methods as a User instance and implementation classes ends with _.decorator.ts_. Used on Controller classes.
- **Logging**: Logger class to log application data in different levels (error, waring, debug, verbose). Used on Controller, Service and Repository classes;
- **Docker Compose**: File with postgres and pgadmin docker image that could be used instead of have both instalations on local environment. Available on root folder project: docker-compose.yml;
- **Tests**: Tests coverage Service and Repository classes and the implementation is avaliable on __tests__ folder;
- **Rest Client**: All Http calls are avaliable on _rest-client.rest_ files (**VSCode Rest Client plugins**);
