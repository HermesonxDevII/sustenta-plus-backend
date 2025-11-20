import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import { Collection } from './Collection';

interface CollectionPhotoAttributes {
  id: number;
  collection_id: number;
  path: string;
  created_at: Date;
  updated_at: Date;
}
export interface CollectionPhotoCreationAttributes extends Optional<CollectionPhotoAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class CollectionPhoto extends Model<CollectionPhotoAttributes, CollectionPhotoCreationAttributes> implements CollectionPhotoAttributes {
  public id!: number;
  public collection_id!: number;
  public path!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  
  static associate() {
    CollectionPhoto.belongsTo(Collection, { foreignKey: 'collection_id', as: 'collection' });
  }
}

CollectionPhoto.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  collection_id: {
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
  tableName: 'collections_photos',
  timestamps: true,
  underscored: true,
  modelName: 'CollectionPhoto'
});

export default CollectionPhoto;