import {Blazeit} from '../index';
import Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const blazeit = new Blazeit(
    {
        models: [
            {
                employe: {
                    firstName: String,
                    lastName: String
                },
                sector: {
                    name: String,
                    manager: {type: Schema.Types.ObjectId, ref: 'employe'}
                }
            }
        ]
    }
);