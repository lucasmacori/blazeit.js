import {Blazeit} from '../index';
import * as Express from 'express';

const app = new Express();

new Blazeit(
    {
        server: {
            port: 3000,
            express: app,
            bodyType: 'json',
        },
        logging: true,
        database: {
            type: 'sqlite',
            name: 'db.sqlite',
        },
        models: {
            person: {
                firstName: {type: 'string', isRequired: true},
                lastName: {type: 'string', isRequired: true},
                birthDay: {type: 'date'}
            },
            task: {
                title: {type: 'string', isRequired: true},
                description: {type: 'string'},
                done: {type: 'boolean'},
                author: {type: 'relation', reference: 'person', cardinality: 'manyToOne'}
            },
            car: {
                brand: {type: 'string', isRequired: true},
                model: {type: 'string', isRequired: true},
                cylinder: {type: 'number', isRequired: true},
                colour: {type: 'string', isRequired: true}
            }
        },
        cors: true
    }
);
