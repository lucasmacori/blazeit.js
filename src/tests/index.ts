import {Blazeit} from '../index';

const blazeit = new Blazeit(
    {
        database: {
            hostname: 'localhost',
            name: 'test_blazeit',
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