import {Blazeit} from '../index';

const blazeit = new Blazeit(
    {
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