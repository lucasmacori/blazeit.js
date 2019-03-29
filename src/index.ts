import {Server} from './lib/server';
import {EntryPoint} from './lib/classes/entryPoint';
import {Database} from './lib/database';
import {Route} from './lib/classes/route';

import * as Mongoose from 'mongoose';
import {
    generateCreate,
    generateDelete,
    generateGet,
    generateGetById,
    generateSearch,
    generateUpdate
} from "./lib/routes";

export class Blazeit {

    private server: Server;
    private entryPoints: Array<EntryPoint>;
    private database: Database;
    private models: Map<string, any> = new Map<string, any>();
    private bodyType: string = 'JSON';

    /**
     * @param values : the object that contains everything Blazeit needs or does not
     * Available values:
     * {
     *      server: {
     *          port: YOUR_SERVER_PORT, // Default is 3000
     *          express: yourExpressInstance
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
        this.replaceBlazeSyntax();
        this.createDatabase();
        this.createModels();
        this.createEntryPoints();
        this.executeBlazeCommands();
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

    /**
     * replaceBlazeSyntax
     * Replaces all the blaze syntax in the object by the real syntax understood by the ODM / ORM
     */
    private replaceBlazeSyntax(): void {
        const collections: Array<string> = Object.keys(this.values.models);
        collections.forEach(
            (collection: string) => {
                const values: Array<string> = Object.keys(this.values.models[collection]);
                values.forEach(
                    (param: string) => {
                        let value = this.values.models[collection][param];
                        if (typeof value === 'string') {
                            if (collections.indexOf(value) === -1) {
                                throw 'The \'' + value + '\' model does not exist. Please check the syntax';
                            }
                            this.values.models[collection][param] = { type: Mongoose.Schema.Types.ObjectId, ref: value };
                        }
                    }
                )
            }
        )
    }

    /**
     * executeBlazeCommands
     * Executes the blaze commands given in the object (The body type for example 'JSON' or 'form')
     */
    private executeBlazeCommands(): void {
        if (this.values.server) {
            if (this.values.server.bodyType) {
                if (this.values.server.bodyType.toLowerCase() === 'json') {
                    this.bodyType = 'json';
                } else if (this.values.server.bodyType.toLowerCase() === 'form') {
                    this.bodyType = 'form';
                } else {
                    throw this.values.server.bodyType.toLowerCase() + ' is not a valid body type. Use either "json" or "form"';
                }
            }
        }
    }

    /**
     * createDatabase
     * Generate the database from the database object
     */
    private createDatabase(): void {
        let hostname: string;
        let port: number;
        let name: string;
        if (this.values.database) {
            hostname = (this.values.database['hostname']) ? this.values.database['hostname'] : 'localhost';
            port = (this.values.database['port']) ? this.values.database['port'] : 27017;
            name = (this.values.database['name']) ? this.values.database['name'] : 'Blazeit';
        } else {
            hostname = 'localhost';
            port = 27017;
            name = 'Blazeit'
        }
        this.database = new Database(hostname, port, name);
    }

    /**
     * createModels
     * Generates the models from the models object
     */
    private createModels(): void {
        const collections: Array<string> = Object.keys(this.values.models);
        collections.forEach(
            (collection: string) => {
                this.models.set(
                    collection,
                    Mongoose.model(
                        collection,
                        new Mongoose.Schema(this.values.models[collection])
                    )
                );
            }
        )
    }

    /**
     * createEntryPoints
     * Generates the entryPoints from the models
     */
    private createEntryPoints(): void {
        // TODO: Split this in several functions
        // This is NOT okay ! o(>< )o
        const entryPoints: Array<EntryPoint> = new Array<EntryPoint>();

        // Getting the name of the collections of the model
        const collections: Array<string> = Object.keys(this.values.models);

        collections.forEach(
            (collection: string) => {
                entryPoints.push(
                    new EntryPoint(
                        '/' + collection,
                        new Array<Route>(
                            generateGet(this.models, collection),
                            generateGetById(this.models, collection),
                            generateCreate(this.models, collection),
                            generateSearch(this.models, collection),
                            generateUpdate(this.models, collection),
                            generateDelete(this.models, collection),
                        )
                    )
                );
            }
        );
        this.entryPoints = entryPoints;
    }

    /**
     * createServer
     * Create the server from the server object
     */
    private createServer(): void {
        let port: number;
        let server: any;
        if (this.values.server) {
            if (this.values.server.express) {
                server = this.values.server.express;
            }
            port = (this.values.server['port']) ? this.values.server['port'] : 3000;
        } else {
            port = 3000;
        }
        this.server = new Server(
            port,
            this.entryPoints,
            this.bodyType,
            server
        );
        this.server.serve();
    }
}
