import { EntryPoint } from './entryPoint';
export class Route {
 
    constructor(
        private _endpoint: string,
        private _method: string,
        private _description: string,
        private _action: Function
    ) {}

    // Getters and setters
    public get endpoint(): string {
        return this._endpoint;
    }
    public set endpoint(value: string) {
        this._endpoint = value;
    }

    public get method(): string {
        return this._method;
    }
    public set method(value: string) {
        this._method = value;
    }

    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    public get action(): Function {
        return this._action;
    }
    public set action(value: Function) {
        this._action = value;
    }
}