# Angular Finding Route App

Credits to:
- Code Style: [John Papa](https://github.com/johnpapa)
- Skeleton Template: [Antony Budianto](https://github.com/antonybudianto/angularjs-starter)

### Client Technologies
- AngularJS 1.4.8
- AngularJSDoc 1.5.0
- jQuery 2.1.4
- Gulp 3.9.0
- Bootstrap 3.3.5
- Font Awesome 4.4.0
- NgMap 1.18.4
- Lodash 3.10.1
- HTML5
- LESS

### Server Technologies (for development)
- NodeJS 7.4.0
- ExpressJS 4.9.3

### Code Analyzer
- JSHint (JavaScript Code Quality Tool)
- JSCS (JavaScript Code Style Checker)

### How to run in local
- Set Environment Variable `NODE_ENV` to `build` if you wan to run the build result.
- Set `API_HOST` in `src/client/app/core/constant.js` to you local API URL

- Install NodeJS (LTS Version)

- Install bower and gulp

```
npm install -g bower gulp
```

- Install dependencies (bower & npm)

```
npm install && bower install
```
- Run in development mode

```
gulp serve-dev
```

- Run in production mode

```
gulp serve-build
```

- Build the application

```
gulp build
```

- Generate JSDoc

```
gulp docs
```