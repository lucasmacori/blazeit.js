![BlazeIt.js](blazeit.js.png)

**An extremely quick way to create a CRUD server out of a JS object**

# Installation
Before using BlazeIt.js, you will need a MongoDB server installed either on your computer, or a network accessible server.

If not, download it [here](https://www.mongodb.com/download-center/community).

Then, in a Node.js project. Install BlazeIt.js with the following command:
``` bash
npm install blazeit
```

# Usage
Here's how to create a BlazeIt.js instance.
``` javascript
const {Blazeit} = require('blazeit');

const myBlazeItServer = new Blazeit({
    // Your settings here
    // Report to the documentation
    database: {
        hostname: 'localhost',
        type: 'sqlite'
        name: 'test_blazeit.sqlite',
    },
    models: {
        person: {
            firstName: { type: 'string', isRequired: true },
            lastName: { type: 'string', isRequired: true },
            birthDay: { type: 'date' },
            isMarried: { type: 'boolean' },
            numberOfChildren: { type: 'number' }
        }
    }
});
```

# Documentation
When calling BlazeIt.js, you have to pass it arguments.
Here are the possibilities:
- server
    - port (default is 3000)
    - express (an existing express instance. If not given, BlazeIt will generate one)
    - bodyType (default is 'json', you can use 'json' or 'form')
- database
    - hostname (default is localhost)
    - port (default is the database default, '27017' for mongoDB for example)
    - name (default is 'Blazeit')
    - username
    - password
- models
- logging (default is 'true')

BlazeIt.js relies on Mongoose's data types, you can use any of the available types.
Here's a list of those types:
- String
- Number
- Date
- Boolean

You can also create associations by defining the type as 'NAME_OF_ASSOCIATION'.\
Look below to see an example.

**Example**

Here's an example of a BlazeIt.js server with a list of Employees
``` javascript
const {Blazeit} = require('blazeit');

const myBlazeItServer = new Blazeit({
    // Your settings here
    // Report to the documentation
    server: {
        port: 3000
    },
    database: {
        hostname: 'localhost',
        type: 'postgres'
        name: 'MyCompanyAPI',
        hostname: 'localhost',
        username: 'postgres',
        password: ''
    },
    models: {
        employee: {
            firstName: { type: 'string', isRequired: true },
            lastName: { type: 'string', isRequired: true },
            email: { type: 'string' }, // isRequired is false by default
            phone: { type: 'string' },
            jobDescription: { type: 'string' }
        },
        sector: {
            name: String
        }
    }
});
```

In this example, the following routes will be generated:
- GET       localhost:3000/employee         : Gets all the employees
- GET       localhost:3000/employee/:id     : Gets the employee with the given id
- POST      localhost:3000/employee         : Adds a new employee
- PUT       localhost:3000/employee         : Edits an existing employee
- DELETE    localhost:3000/employee         : Deleting an existing employee

- GET       localhost:3000/sector           : Gets all the sectors
- GET       localhost:3000/sector/:id       : Gets the sector with the given id
- POST      localhost:3000/sector           : Adds a new sector
- PUT       localhost:3000/sector           : Edits an existing sector
- DELETE    localhost:3000/sector           : Deleting an existing sector

# Roadmap
**v1.0.0** stable
- Default values
- Unique values
- Associations / relationships
- Authentification (OAuth, token generation, usernames and passwords)
- Generate random data
- Manual Express routes
- CORS support
- Swagger implementation

# Information
BlazeIt.js is free of charge and can be modified and shared freely.
Although it comes with absolutely NO warranty whatsoever.

So please, be minded of that before starting any type of project with BlazeIt.js
