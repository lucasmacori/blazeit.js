import {Field} from "./field";

export class Model {
    constructor(
        private _name: string,
        private _fields: Array<Field>
    ) {
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get fields(): Array<Field> {
        return this._fields;
    }

    set fields(value: Array<Field>) {
        this._fields = value;
    }
}
