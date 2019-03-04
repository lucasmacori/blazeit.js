import {Blazeit} from '../index';

const blazeit = new Blazeit(
    {
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