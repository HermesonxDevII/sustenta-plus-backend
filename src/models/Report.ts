import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Status } from './Status';
import { ReportPhoto } from './ReportPhoto';

interface ReportAttributes {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  postal_code?: string;
  status_id: number;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
export interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {}

export class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public id!: number;
  public user_id!: number;
  public title!: string;
  public description?: string;
  public street?: string;
  public number?: string;
  public neighborhood?: string;
  public postal_code?: string;
  public status_id!: number;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public user?: User;
  public status?: Status;

  static associate() {
    Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    Report.belongsTo(Status, { foreignKey: 'status_id', as: 'status' });
    Report.hasMany(ReportPhoto, { foreignKey: 'report_id', as: 'photos' });
  }
}

Report.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  street: DataTypes.STRING,
  number: DataTypes.STRING,
  neighborhood: DataTypes.STRING,
  postal_code: DataTypes.STRING,
  status_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  deleted_at: DataTypes.DATE,
  created_at: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
}, {
  sequelize,
  tableName: 'reports',
  timestamps: true,
  underscored: true,
  paranoid: true,
  modelName: 'Report'
});

export default Report;
