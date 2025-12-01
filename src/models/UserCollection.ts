import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Collection } from './Collection';
import { Status } from './Status';

interface UserCollectionAttributes {
  id: number;
  user_id: number;
  collection_id: number;
  status_id: number;
  completed_at?: number;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
export interface UserCollectionCreationAttributes extends Optional<UserCollectionAttributes, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {}

export class UserCollection extends Model<UserCollectionAttributes, UserCollectionCreationAttributes> implements UserCollectionAttributes {
  public declare id: number;
  public declare user_id: number;
  public declare collection_id: number;
  public declare status_id: number;
  public declare completed_at?: number;
  public declare deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public user?: User;
  public collection?: Collection;
  public status?: Status;

  static associate() {
    UserCollection.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    UserCollection.belongsTo(Collection, { foreignKey: 'collection_id', as: 'collection' });
    UserCollection.belongsTo(Status, { foreignKey: 'status_id', as: 'status' });
  }
}

UserCollection.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  collection_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  completed_at: DataTypes.BIGINT,
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
  tableName: 'users_collections',
  timestamps: true,
  underscored: true,
  paranoid: true,
  modelName: 'UserCollection'
});

export default UserCollection;
