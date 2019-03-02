import * as Mongoose from 'mongoose';

export class Database {

    constructor(
        private _hostname: string,
        private _port: number,
        private _name: string
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

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    /**
     * init()
     * Initialize the connection to the database
     */
    private init(): void {
        const hostnameStr: string = (this.hostname) ? this.hostname : 'localhost';
        const portStr: string = (this.port) ? ':' + this.port : '';
        const nameStr: string = (this.name) ? this.name : 'Blazeit';
        Mongoose.connect(
            'mongodb://' +
            hostnameStr + '/'+
            portStr +
            nameStr,
            { useNewUrlParser: true }
        );
    }
}