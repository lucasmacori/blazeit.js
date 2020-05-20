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
import {Model} from './lib/classes/model';
import {Field} from './lib/classes/field';
import {BooleanField} from './lib/classes/booleanField';
import {DateField} from './lib/classes/dateField';
import {NumberField} from './lib/classes/numberField';
import {StringField} from './lib/classes/stringField';
import {RelationField} from "./lib/classes/relationField";

export class Blazeit {

    private server: Server;
    private entryPoints: Array<EntryPoint>;
    private database: Database;
    private bodyType: string = 'JSON';

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
    // TODO: Implement the new version for this
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
        let type: string = 'mongodb';
        let hostname: string = 'localhost';
        let port: number = 27017;
        let name: string = 'Blazeit';
        let username: string;
        let password: string;
        if (this.values.database) {
            type = (this.values.database['type']) ? this.values.database['type'] : 'mongodb';
            hostname = (this.values.database['hostname']) ? this.values.database['hostname'] : undefined;
            port = (this.values.database['port']) ? this.values.database['port'] : undefined;
            name = (this.values.database['name']) ? this.values.database['name'] : undefined;
            username = (this.values.database['username']) ? this.values.database['username'] : undefined;
            password = (this.values.database['password']) ? this.values.database['password'] : undefined;
            if (type != 'sqlite') {
                hostname = (this.values.database['hostname']) ? this.values.database['hostname'] : 'localhost';
            }
        }
        this.database = new Database(hostname, name, type, port, username, password, this.values.logging);
    }

    /**
     * createModels
     * Generates the models from the models object
     */
    private createModels(): void {
        const collections: Array<string> = Object.keys(this.values.models);
        collections.forEach(
            (collection: string) => {
                const value = this.translateBlazeModel(
                    collection,
                    this.values.models[collection]
                );
                this.database.addModel(value);
            }
        );
    }

    /**
     * translateBlazeModel
     * Create the Model object that represents the given object
     * @param name The name of the model
     * @param model The model object
     */
    private translateBlazeModel(name: string, model: any): Model {
        const fields = new Array<Field>();
        const attributes: Array<string> = Object.keys(model);

        // Iterating through the models
        attributes.forEach(
            (attribute: string) => {
                const value = model[attribute];

                // Creating the objects
                if (value.type) {
                    switch (value.type.trim().toLowerCase()) {
                        case 'boolean':
                            fields.push(new BooleanField(attribute, value.isRequired, value.isPrimaryKey));
                            break;
                        case 'date':
                            fields.push(new DateField(attribute, value.isRequired, value.isPrimaryKey));
                            break;
                        case 'number':
                            fields.push(new NumberField(attribute, value.isRequired, value.isPrimaryKey, value.max, value.min, value.sqlType));
                            break;
                        case 'string':
                            fields.push(new StringField(attribute, value.isRequired, value.isPrimaryKey, value.length));
                            break;
                        case 'relation':
                            fields.push(new RelationField(attribute, value.isRequired, value.isPrimaryKey));
                            break;
                        case '':
                            throw `You must provide a type for attribute "${attribute}"`;
                        default:
                            throw `Type "${value.type} is not supported"`;
                    }
                } else {
                    throw `You must provide a type for attribute "${attribute}"`;
                }
            }
        );

        // Creating and returning the model object
        return new Model(name, fields);
    }

    /**
     * createEntryPoints
     * Generates the entryPoints from the models
     */
    private createEntryPoints(): void {
        const entryPoints: Array<EntryPoint> = new Array<EntryPoint>();

        // Getting the name of the collections of the model
        const collections: Array<string> = Object.keys(this.values.models);

        collections.forEach(
            (collection: string) => {
                entryPoints.push(
                    new EntryPoint(
                        '/' + collection,
                        new Array<Route>(
                            generateGet(this.database, collection),
                            generateGetById(this.database, collection),
                            generateCreate(this.database, collection),
                            generateSearch(this.database, collection),
                            generateUpdate(this.database, collection),
                            generateDelete(this.database, collection)
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
        let port: number = 3000;
        let server: any;
        if (this.values.server) {
            if (this.values.server.express) {
                server = this.values.server.express;
            }
            port = (this.values.server['port']) ? this.values.server['port'] : 3000;
        }
        this.server = new Server(
            port,
            this.entryPoints,
            this.bodyType,
            this.values.cors,
            server
        );
        this.server.serve();
    }
}
