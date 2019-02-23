import { Server } from './lib/server';
import { EntryPoint } from './lib/classes/entryPoint';
import { Database } from './lib/database';
import { Route } from './lib/classes/route';

import * as Mongoose from 'mongoose';
import { createServer } from 'http';

export class Blazeit {

    private server: Server;
    private entryPoints: Array<EntryPoint>;
    private database: Database;

    /**
     * @param values : the object that contains everything Blazeit needs or does not
     * Available values:
     * {
     *      server: {
     *          port: YOUR_SERVER_PORT, // Default is 3000
     *      },
     *      database: {
     *          hostname: 'YOUR_HOSTNAME', // 'localhost' if not given
     *          port: YOUR_PORT, // 27017 if not given,
     *          databaseName: 'YOUR_DATABASE_NAME', // 'Blazeit' if not given
     *      },
     *      models: [
     *          person: { // Example with a person
     *              firstName: String,
     *              lastName: String,
     *              birthDay: Date,
     *              isMarried: Boolean,
     *              numberOfChildren: Number
     *          }
     *      ]
     * }
     */
    constructor(private values: any) {
        this.checkValues();
        this.createDatabase();
        this.createModels();
        this.createEntryPoints();
        this.createServer();
    }

    /**
     * checkValues
     * Checks if the given values are correct
     */
    private checkValues(): void {
        // Checking models
        if (this.values.models) {
            if (this.values.models.length < 1) {
                throw 'You must pass at least one model, none was given';
            }
        } else {
            throw 'You must pass at least one model, none was given';
        }
    }

    private createDatabase(): void {
        this.database = new Database(
            this.values.database['hostname'],
            this.values.database['port'],
            this.values.database['name']
        );
    }

    private createModels(): void {
        // Create a model for each model given in the values
        // And store them in a dict of models
        // Name: entrypoint_endpoint
    }

    private createEntryPoints(): void {
        // TODO: Split this in several functions
        // This is NOT okay ! o(>< )o
        const entryPoints: Array<EntryPoint> = new Array<EntryPoint>();

                this.values.models.forEach(
                    (model: any) => {
                        // Getting the name of the columns of the model
                        const columns: Array<string> = Object.keys(model);

                        columns.forEach(
                            (column: string) => {
                                entryPoints.push(
                                    new EntryPoint(
                                        '/' + column,
                                        new Array<Route>(
                                            new Route(
                                                '/',
                                                'GET',
                                                'GET ' + column,
                                                (req, res) => {
                                                    res.send('GET ' + column);
                                                }
                                            ),
                                            new Route(
                                                '/',
                                                'POST',
                                                'POST ' + column,
                                                (req, res) => {
                                                    res.send('POST ' + column);
                                                }
                                            ),
                                            new Route(
                                                '/',
                                                'PUT',
                                                'PUT ' + column,
                                                (req, res) => {
                                                    res.send('PUT ' + column);
                                                }
                                            ),
                                            new Route(
                                                '/',
                                                'DELETE',
                                                'DELETE ' + column,
                                                (req, res) => {
                                                    res.send('DELETE ' + column);
                                                }
                                            ),
                                        )
                                    )
                                );
                            } // Is it over yet ?
                        );
                    }
                );
                this.entryPoints = entryPoints;
    }

    /**
     * createServer
     * Create a server with the given parameters and generated entrypoints
     */
    private createServer(): void {
        const port: number = (this.values.server['port']) ? this.values.server['port'] : 3000;
        this.server = new Server(port, this.entryPoints);
        this.server.serve();
    }
}