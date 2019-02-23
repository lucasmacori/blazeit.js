import { Blazeit } from '../index';

const blazeit = new Blazeit(
    {
        server: {
            port: 3000,
        },
        database: {
            hostname: 'localhost',
            databaseName: 'test_blazeit',
        },
        models: [
            {
                person: {
                    firstName: String,
                    lastName: String,
                    birthDay: Date,
                    isMarried: Boolean,
                    numberOfChildren: Number
                }
            }
        ]
    }
);