import {Field} from "./field";

export class DateField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false
    ) {
        super(_name, _required, _isPrimaryKey);
    }
}
