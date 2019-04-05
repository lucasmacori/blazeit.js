import {Blazeit} from '../index';
import * as Express from 'express';

const app = new Express();

const blazeit = new Blazeit(
    {
        server: {
            port: 3001,
            express: app,
            bodyType: "json"
        },
        database: {
            type: 'sqlite',
            name: 'db.sqlite'
        },
        models: {
            employe: {
                firstName: String,
                lastName: String
            },
            sector: {
                name: String,
                manager: 'employe'
            }
        }
    }
);
