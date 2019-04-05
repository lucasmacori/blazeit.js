import {Field} from "./field";

export enum NumberSQLTypes {
    INT, BIGINT, DOUBLE, FLOAT, DECIMAL
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
        super(_name, _required, _isPrimaryKey);
    }
}
