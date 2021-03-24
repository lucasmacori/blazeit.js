import {Field} from "./field";
import {DataTypes} from "sequelize";
import {Types} from 'mongoose';

export class RelationField extends Field {
    constructor(
        private _name: string,
        private _required: boolean = false,
        private _isPrimaryKey: boolean = false,
        private _reference: string = undefined,
        private _key: string = 'id'
    ) {
        super(_name, _required, _isPrimaryKey);
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
