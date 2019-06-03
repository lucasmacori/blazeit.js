import {Field} from "./field";
import { CHAR, TEXT } from "sequelize";

export class StringField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false,
        private _length: number = undefined
    ) {
        super(_name, _required, _isPrimaryKey);
    }

    get length(): number {
        return this._length;
    }

    set length(length: number) {
        this._length = length;
    }

    translateForMongoose(): object {
        return { type: String, required: this.fieldRequired, match: (this._length) ? '/^.{0,' + this._length + '}$/': undefined };
    }

    translateForSequelize(): object {
        return {
            type: (this._length) ? CHAR : TEXT, allowNull: !this.fieldRequired,
            primaryKey: this.fieldIsPrimaryKey, length: this._length
        };
    }
}   
