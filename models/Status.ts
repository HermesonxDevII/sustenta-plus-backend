import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import { Report } from './Report';
import { Collection } from './Collection';

interface StatusAttributes {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface StatusCreationAttributes extends Optional<StatusAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
  public id!: number;
  public name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public reports?: Report[];
  public collections?: Collection[];

  static associate() {
    Status.hasMany(Report, { foreignKey: 'status_id', as: 'reports' });
    Status.hasMany(Collection, { foreignKey: 'status_id', as: 'collections' });
  }
}

Status.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updated_at: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  sequelize,
  tableName: 'status',
  timestamps: true,
  underscored: true,
  modelName: 'Status'
});

export default Status;