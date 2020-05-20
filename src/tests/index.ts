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
            type: 'sqlite',
            name: 'db.sqlite',
        },
        models: {
            task: {
                title: {type: 'string'},
                description: {type: 'string'},
                done: {type: 'boolean'}
            }
        }
    }
);
