import {Blazeit} from '../index';
import * as Express from 'express';

const app = new Express();

new Blazeit(
    {
        server: {
            port: 3000,
            express: app,
            bodyType: 'json'
        },
        database: {
            type: 'mysql',
            hostname: '192.168.0.15',
            port: 3306,
            name: 'blazeit',
            username: 'blazeit',
            password: 'blazeit'
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
                author: {type: 'relation', reference: 'person'}
            }
        },
        cors: true
    }
);
