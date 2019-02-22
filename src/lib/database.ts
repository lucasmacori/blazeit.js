import * as Mongoose from 'mongoose';

export class Database {

    constructor(
        private _hostname: string,
        private _port: number,
        private _databaseName: string
    ) {
        this.init();
    }

    // Getters and setters
    public get hostname(): string {
        return this._hostname;
    }
    public set hostname(value: string) {
        this._hostname = value;
    }

    public get port(): number {
        return this._port;
    }
    public set port(value: number) {
        this._port = value;
    }

    public get databaseName(): string {
        return this._databaseName;
    }
    public set databaseName(value: string) {
        this._databaseName = value;
    }

    /**
     * init()
     * Initialize the connection to the database
     */
    private init(): void {
        const portStr: string = (this.port) ? ':' + this.port : '';
        Mongoose.connect(
            'mongodb://' +
            this.hostname + '/'+
            portStr +
            this.databaseName,
            { useNewUrlParser: true }
        );
    }
}