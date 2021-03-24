import * as Mongoose from 'mongoose';
import * as Sequelize from 'sequelize';
import {Model} from './classes/model';

export class Database {

    constructor(
        private _hostname: string,
        private _name: string,
        private _type: string = undefined,
        private _port: number = undefined,
        private _username: string = undefined,
        private _password: string = undefined,
        private _logging: boolean = true
    ) {
        this.init();
    }

    private _connection: Sequelize.Sequelize;
    private _models: Map<string, any> = new Map<string, any>();

    // Getters and setters
    public get hostname(): string {
        return this._hostname;
    }

    public get connection(): any {
        return this._connection;
    }

    public get models(): any {
        return this._models;
    }

    public get name(): string {
        return this._name;
    }

    public get port(): number {
        return this._port;
    }

    public get type(): string {
        return this._type;
    }

    public get username(): string {
        return this._username;
    }

    public get password(): string {
        return this._password;
    }

    public get logging(): boolean {
        return this._logging;
    }

    public set logging(logging: boolean) {
        this._logging = logging;
    }

    /**
     * init
     * Initialize the connection to the database
     */
    private init(): void {
        const hostnameStr: string = (this._hostname) ? this._hostname : 'localhost';
        const portStr: string = (this._port) ? ':' + this._port : '';
        const nameStr: string = (this._name) ? this._name : 'Blazeit';
        const passwordStr: string = (this._password) ? this._password : '';
        this._type = this._type.toLowerCase();
        if (this._type === 'mongodb') {
            Mongoose.connect(
                'mongodb://' +
                hostnameStr +
                portStr + '/' +
                nameStr,
                {useNewUrlParser: true}
            );
            Mongoose.set('debug', this._logging);
        } else if (this._type === 'mysql' || this._type === 'mariadb' || this._type === 'postgres' || this._type === 'mssql') {
            if (this._username && this._name) {
                // @ts-ignore
                this._connection = new Sequelize(this._name, this._username, passwordStr, {
                    host: hostnameStr,
                    dialect: this._type,
                    logging: this._logging
                });
            } else {
                throw 'When using mysql, mariadb, postgres or mssql. You must provide a database name and an username';
            }
        } else if (this._type === 'sqlite') {
            if (this._name) {
                // @ts-ignore
                this._connection = new Sequelize({
                    storage: this._name,
                    dialect: this._type,
                    logging: this._logging
                });
            } else {
                throw 'When using sqlite, you must provide a database name (which is your sqlite file path)';
            }
        } else {
            throw 'This type of database is unknown or not supported. Please use one from this list: mongodb, mariadb, mysql, postgres, mssql, sqlite';
        }
    }

    public addModel(model: Model) {
        if (this._type === 'mongodb') {
            this.models.set(
                model.name,
                Mongoose.model(
                    model.name,
                    new Mongoose.Schema(model.getMongooseDefinition())
                )
            );
        } else {
            console.log('Création du model ' + model.name)
            const sModel =  this._connection.define(
                model.name,
                model.getSequelizeDefinition(),
                {
                    // Prevent Sequelize from using a pluralized name
                    freezeTableName: true
                }
            );
            sModel.sync({alter: true});
            this.models.set(
                model.name,
                sModel
            );
        }
    }
}
