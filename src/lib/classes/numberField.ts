import {Field} from "./field";
import { INTEGER, BIGINT, DECIMAL, DOUBLE, FLOAT } from "sequelize";

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

    translateForMongoose(): object {
        return { type: Number, required: this.fieldRequired };
    }

    translateForSequelize(): object {
        return {
            type: this.getSequelizeTypeFromSQLType(this._sqlType),
            allowNull: !this.fieldRequired, primaryKey: this.fieldIsPrimaryKey
        };
    }

    private getSequelizeTypeFromSQLType(numberSQLType: NumberSQLTypes): any {
        if (numberSQLType === NumberSQLTypes.INT) {
            return INTEGER;
        } else if (numberSQLType === NumberSQLTypes.BIGINT) {
            return BIGINT;
        } else if (numberSQLType === NumberSQLTypes.DECIMAL) {
            return DECIMAL;
        } else if (numberSQLType === NumberSQLTypes.DOUBLE) {
            return DOUBLE;
        } else if (numberSQLType === NumberSQLTypes.FLOAT) {
            return FLOAT;
        }
    }
}
