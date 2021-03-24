import {Field} from "./field";
import * as Mongoose from 'mongoose';

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

    getMongooseDefinition(): object {
        const definition = { id: Mongoose.Schema.Types.ObjectId };
        this._fields.forEach(
            (field: Field) => {
                definition[field.fieldName] = field.translateForMongoose();
            }
        );
        return definition;
    }

    getSequelizeDefinition(): any {
        const definition = {};
        this._fields.forEach(
            (field: Field) => {
                definition[field.fieldName] = field.translateForSequelize();
            }
        );
        return definition;
    }
}
