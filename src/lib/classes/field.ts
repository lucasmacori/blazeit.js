import { IField } from "../interfaces/field";

export abstract class Field implements IField {
    
    constructor(
        private _fieldName: string,
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
    
    translateForMongoose(): object {
        throw new Error("Method not implemented.");
    }
    
    translateForSequelize(): object {
        throw new Error("Method not implemented.");
    }
}