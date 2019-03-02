import {Route} from './route';

export class EntryPoint {

    constructor(
        private _name: string,
        private _routes: Array<Route>
    ) {}

    // Getters and setters
    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
    }

    public get routes(): Array<Route> {
        return this._routes;
    }
    public set routes(routes: Array<Route>) {
        this._routes = routes;
    }
}