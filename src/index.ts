import {Server} from './lib/server';
import {EntryPoint} from './lib/classes/entryPoint';
import {Database} from './lib/database';
import {Route} from './lib/classes/route';

import * as Mongoose from 'mongoose';

export class Blazeit {

    private server: Server;
    private entryPoints: Array<EntryPoint>;
    private database: Database;
    private models: Map<string, any> = new Map<string, any>();

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
        this.values.models.forEach(
            (model: any, index) => {
                const collections: Array<string> = Object.keys(model);
                this.models.set(
                    collections[index],
                    Mongoose.model(
                        collections[index],
                        new Mongoose.Schema(model[collections[index]])
                    )
                );
            }
        );
    }

    private createEntryPoints(): void {
        // TODO: Split this in several functions
        // This is NOT okay ! o(>< )o
        const entryPoints: Array<EntryPoint> = new Array<EntryPoint>();

        this.values.models.forEach(
            (model: any) => {
                // Getting the name of the collections of the model
                const collections: Array<string> = Object.keys(model);

                collections.forEach(
                    (collection: string) => {
                        entryPoints.push(
                            new EntryPoint(
                                '/' + collection,
                                new Array<Route>(
                                    new Route(
                                        '/',
                                        'GET',
                                        'GET ' + collection,
                                        (req, res) => {
                                            this.models.get(collection).find({})
                                                .exec(
                                                    (err: any, objects: Array<any>) => {
                                                        if (!err) {
                                                            res.json(objects);
                                                        } else {
                                                            res.status(500);
                                                            res.json({
                                                                message: 'Could not get ' + collection + '\n' + err
                                                            });
                                                        }
                                                    }
                                                );
                                        }
                                    ),
                                    new Route(
                                        '/',
                                        'POST',
                                        'POST ' + collection,
                                        (req, res) => {
                                            this.models.get(collection).create(
                                                req.body,
                                                (err: any) => {
                                                    if (!err) {
                                                        res.json({ status: 'OK' });
                                                    } else {
                                                        res.status(500);
                                                        res.json({
                                                            message: 'Could not create ' + collection + '\n' + err 
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    ),
                                    new Route(
                                        '/',
                                        'PUT',
                                        'PUT ' + collection,
                                        (req, res) => {
                                            this.models.get(collection).updateOne(
                                                req.body,
                                                (err: any) => {
                                                    if (!err) {
                                                        res.json({ status: 'OK' });
                                                    } else {
                                                        res.status(500);
                                                        res.json({
                                                            message: 'Could not update ' + collection + '\n' + err 
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    ),
                                    new Route(
                                        '/',
                                        'DELETE',
                                        'DELETE ' + collection,
                                        (req, res) => {
                                            this.models.get(collection).deleteOne(req.body)
                                                .exec(
                                                    (err: any) => {
                                                        if (!err) {
                                                            res.json({ status: 'OK' });
                                                        } else {
                                                            res.status(500);
                                                            res.json({
                                                                message: 'Could not delete ' + collection + '\n' + err 
                                                            });
                                                        }
                                                    }
                                                );
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