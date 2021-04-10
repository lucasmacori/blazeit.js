import { Model } from "sequelize";
import { capitalize } from 'lodash';

export class SequelizeModel extends Model {

    public async lazyLoad(associations, { refresh } = { refresh: false }) {
        await Promise.all(associations.map(async association => {
          if (!this[association] || refresh) {
            const loader = `get${capitalize(association)}`;
            this[association] = await this[loader]();
          }
        }));
      
        return Promise.resolve(this);
    }
}