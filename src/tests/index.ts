import {Blazeit} from '../index';
import * as Express from 'express';

const app = new Express();

const blazeit = new Blazeit(
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
            employe: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                married: { type: 'boolean' }
            },
            sector: {
                name: { type: 'string' },
                creationDate: { type: 'date' }
            }
        }
    }
);
