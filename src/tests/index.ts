import {Blazeit} from '../index';
import * as Express from 'express';

const app = new Express();

new Blazeit(
    {
        server: {
            port: 3002,
            express: app,
            bodyType: 'json'
        },
        database: {
            type: 'sqlite',
            name: 'db.sqlite',
        },
        models: {
            sector: {
                name: {type: 'string'},
                creationDate: {type: 'date'}
            },
            employe: {
                firstName: {type: 'string', isRequired: true},
                lastName: {type: 'string', isRequired: true},
                married: {type: 'boolean'},
                sector: {type: 'relation'}
            }
        }
    }
);
