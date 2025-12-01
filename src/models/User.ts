import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import { Role } from './Role'; 
import { Report } from './Report';
import { Collection } from './Collection';
import { UserCollection } from './UserCollection';

export interface UserAttributes {
  id: number;
  name: string;
  cpf: string;
  email: string;
  password: string; 
  phone?: string;
  profile_photo?: string;
  status?: boolean;
  role_id: number;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'status'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public declare id: number;
  public declare name: string;
  public declare cpf: string;
  public declare email: string;
  public declare password: string;
  public declare phone?: string;
  public declare profile_photo?: string;
  public declare status: boolean;
  public declare role_id: number;
  public declare deleted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public declare role?: Role;
  public declare reports?: Report[];
  public declare collections?: Collection[];
  public declare interactedCollections?: Collection[];
  
  static associate() {
    User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
    User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
    User.hasMany(Collection, { foreignKey: 'user_id', as: 'collections' });
    User.belongsToMany(Collection, {
      through: UserCollection,
      foreignKey: 'user_id',
      otherKey: 'collection_id',
      as: 'interactedCollections'
    });
  }
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  cpf: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: DataTypes.STRING,
  profile_photo: DataTypes.STRING,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  role_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  deleted_at: DataTypes.DATE,
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
  tableName: 'users',
  timestamps: true,
  underscored: true,
  paranoid: true,
  modelName: 'User'
});

export default User;