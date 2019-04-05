export class Field {
    constructor(
        private _fieldName: string,
        private _fieldType: string,
        private _fieldRequired: boolean = false,
        private _fieldIsPrimaryKey: boolean = false
    ) {
    }

    get fieldName(): string {
        return this._fieldName;
    }

    set fieldName(value: string) {
        this._fieldName = value;
    }

    get fieldType(): string {
        return this._fieldType;
    }

    set fieldType(value: string) {
        this._fieldType = value;
    }

    get fieldRequired(): boolean {
        return this._fieldRequired;
    }

    set fieldRequired(value: boolean) {
        this._fieldRequired = value;
    }

    get fieldIsPrimaryKey(): boolean {
        return this._fieldIsPrimaryKey;
    }

    set fieldIsPrimaryKey(value: boolean) {
        this._fieldIsPrimaryKey = value;
    }
}
