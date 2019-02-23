import { Server } from './lib/server';
import { EntryPoint } from './lib/classes/entryPoint';
import { Database } from './lib/database';

export class Blazeit {

    private server: Server;
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
     *              numberOfChildren: number
     *          }
     *      ]
     * }
     */
    constructor(private values: any) {
        this.checkValues();
        this.createDatabase();
        this.createEntryPoints()
            .then(
                (entryPoints: Array<EntryPoint>) => {
                    this.createServer(entryPoints);
                }
            )
            .catch(
                (err: any) => {
                    throw err;
                }
            );
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

    private createEntryPoints(): Promise<Array<EntryPoint>> {
        return new Promise(
            (resolve, reject) => {
                // TODO: For each model, create an entrypoint with the name of that model.
                // Create a GET, POST, PUT and DELETE method
            }
        );
    }

    /**
     * createServer
     * Create a server with the given parameters and generated entrypoints
     */
    private createServer(entryPoints: Array<EntryPoint>): void {
        const port: number = (this.values.server['port']) ? this.values.server['port'] : 3000;
        this.server = new Server(port, entryPoints);
        this.server.serve();
    }
}