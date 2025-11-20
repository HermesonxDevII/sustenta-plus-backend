import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import { Report } from './Report';

interface ReportPhotoAttributes {
  id: number;
  report_id: number;
  path: string;
  created_at: Date;
  updated_at: Date;
}
export interface ReportPhotoCreationAttributes extends Optional<ReportPhotoAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class ReportPhoto extends Model<ReportPhotoAttributes, ReportPhotoCreationAttributes> implements ReportPhotoAttributes {
  public id!: number;
  public report_id!: number;
  public path!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  
  static associate() {
    ReportPhoto.belongsTo(Report, { foreignKey: 'report_id', as: 'report' });
  }
}

ReportPhoto.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  report_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
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
  tableName: 'reports_photos',
  timestamps: true,
  underscored: true,
  modelName: 'ReportPhoto'
});

export default ReportPhoto;