import {Field} from "./field";

export enum StringSQLTypes {
    VARCHAR, TEXT, TINYTEXT
}

export class stringField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false,
        private _maxLength: number = undefined,
        private _minLength: number = undefined,
        private _sqlType: StringSQLTypes = StringSQLTypes.VARCHAR,
        private _notEmpty: boolean = false,
        private _isEmail: boolean = false,
        private _isUrl: boolean = false,
        private _isIn: Array<string> = []
    ) {
        super(_name, _required, _isPrimaryKey);
    }


    get maxLength(): number {
        return this._maxLength;
    }

    set maxLength(value: number) {
        this._maxLength = value;
    }

    get minLength(): number {
        return this._minLength;
    }

    set minLength(value: number) {
        this._minLength = value;
    }

    get sqlType(): StringSQLTypes {
        return this._sqlType;
    }

    set sqlType(value: StringSQLTypes) {
        this._sqlType = value;
    }

    get notEmpty(): boolean {
        return this._notEmpty;
    }

    set notEmpty(value: boolean) {
        this._notEmpty = value;
    }

    get isEmail(): boolean {
        return this._isEmail;
    }

    set isEmail(value: boolean) {
        this._isEmail = value;
    }

    get isUrl(): boolean {
        return this._isUrl;
    }

    set isUrl(value: boolean) {
        this._isUrl = value;
    }

    get isIn(): Array<string> {
        return this._isIn;
    }

    set isIn(value: Array<string>) {
        this._isIn = value;
    }
}
