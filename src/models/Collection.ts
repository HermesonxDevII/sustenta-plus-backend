import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Status } from './Status';
import { CollectionPhoto } from './CollectionPhoto';
import { UserCollection } from './UserCollection';

interface CollectionAttributes {
  id: number;
  user_id: number;
  street: string;
  number?: string;
  neighborhood: string;
  postal_code: string;
  status_id: number;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
export interface CollectionCreationAttributes extends Optional<CollectionAttributes, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {}

export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
  public id!: number;
  public user_id!: number;
  public street!: string;
  public number?: string;
  public neighborhood!: string;
  public postal_code!: string;
  public status_id!: number;
  public deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public user?: User;
  public status?: Status;
  public usersInteracting?: User[];

  static associate() {
    Collection.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    Collection.belongsTo(Status, { foreignKey: 'status_id', as: 'status' });
    Collection.hasMany(CollectionPhoto, { foreignKey: 'collection_id', as: 'photos' });
    Collection.belongsToMany(User, {
      through: UserCollection,
      foreignKey: 'collection_id',
      otherKey: 'user_id',
      as: 'usersInteracting'
    });
  }
}

Collection.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: DataTypes.STRING,
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
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
  tableName: 'collections',
  timestamps: true,
  underscored: true,
  paranoid: true,
  modelName: 'Collection'
});

export default Collection;
