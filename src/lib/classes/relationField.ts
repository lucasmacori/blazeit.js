import {Field} from "./field";
import {DataTypes} from "sequelize";
import {Types} from 'mongoose';

export class RelationField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false,
        private _reference: string = undefined,
        private _cardinality: string = 'manyToOne',
        private _key: string = 'id'
    ) {
        super(_name, _required, _isPrimaryKey);
    }

    public get reference(): string {
        return this._reference
    }

    public get cardinality(): string {
        return this._cardinality
    }

    public get key(): string {
        return this._key
    }

    translateForMongoose(): object {
        return {type: Types.ObjectId, required: this.fieldRequired};
    }

    translateForSequelize(): object {
        return {
            type: DataTypes.INTEGER,
            allowNull: !this.fieldRequired,
            references: this._reference ? {
                model: this._reference,
                key: this._key
            } : undefined
        };
    }
}
