import {Field} from "./field";
import { DATE } from "sequelize";

export class DateField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false
    ) {
        super(_name, _required, _isPrimaryKey);
    }

    translateForMongoose(): object {
        return { type: Date, required: this.fieldRequired };
    }

    translateForSequelize(): object {
        return { type: DATE, allowNull: !this.fieldRequired, primaryKey: this.fieldIsPrimaryKey };
    }
}
