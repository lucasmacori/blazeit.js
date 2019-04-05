import {Field} from "./field";

export enum NumberSQLTypes {
    INT, DOUBLE, FLOAT, NUMERIC
}

export class NumberField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false,
        private _max: number = undefined,
        private _min: number = undefined,
        private _sqlType: NumberSQLTypes = NumberSQLTypes.INT
    ) {
        super(_name, 'string', _required, _isPrimaryKey);
    }
}
