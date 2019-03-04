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
        name: 'test_blazeit',
    },
    models: {
        person: {
            firstName: String,
            lastName: String,
            birthDay: Date,
            isMarried: Boolean,
            numberOfChildren: Number
        }
    }
});
```

# Documentation
When calling BlazeIt.js, you have to pass it arguments.
Here are the possibilities:
- server
    - port (default is 3000)
- database
    - hostname (default is localhost)
    - port (default is mongoDB's default: 27017)
    - name (default is 'Blazeit')
- models

BlazeIt.js relies on Mongoose's data types, you can use any of the available types.
Here's a list of those types:
- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Decimal128
- Map

You can also create associations by defining the type as 'NAME_OF_ASSOCIATION'.\
Look below to see an example.

For more information, please visit the [offical Mongoose documentation](https://mongoosejs.com/docs/schematypes.html).

**Example**

Here's an example of a BlazeIt.js server with a list of Employes
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
        port: 27017,
        name: 'MyCompanyAPI',
    },
    models: {
        employe: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            jobDescription: String,
            sector: 'sector'
        },
        sector: {
            name: String,
            manager: 'employe'
        }
    }
});
```

# Information
BlazeIt.js is free of charge and can be modified and shared freely.
Although it comes with absolutely NO warranty whatsoever.

So please, be minded of that before starting any type of project with BlazeIt.js