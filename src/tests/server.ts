import { Server } from '../lib/server';
import { EntryPoint } from '../lib/classes/entryPoint';
import { Route } from '../lib/classes/route';

// Creating the server
const server = new Server(
    3000,
    new Array(
        new EntryPoint(
            '/person',
            new Array<Route>(
                new Route(
                    '/',
                    'GET',
                    'Gets all the people',
                    (req, res) => {
                        res.send('I\'M GETTING EVERYONE !');
                    }
                )
            )
        ),
        new EntryPoint(
            '/person',
            new Array<Route>(
                new Route(
                    '/',
                    'POST',
                    'Creates a new person',
                    (req, res) => {
                        res.send('I\'M CREATING A PERSON !');
                    }
                )
            )
        ),
        new EntryPoint(
            '/person',
            new Array<Route>(
                new Route(
                    '/',
                    'PUT',
                    'Updates a person',
                    (req, res) => {
                        res.send('I\'M UPDATING A PERSON !');
                    }
                )
            )
        ),
        new EntryPoint(
            '/person',
            new Array<Route>(
                new Route(
                    '/',
                    'DELETE',
                    'Deletes a person',
                    (req, res) => {
                        res.send('I\'M DELETING A PERSON !');
                    }
                )
            )
        )
    )
);

// Starting the server
server.serve();