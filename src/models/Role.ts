import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import { User } from './User'; 

interface RoleAttributes {
  id: number;
  name: string;
  ability: string;
  created_at: Date;
  updated_at: Date;
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public declare id: number;
  public declare name: string;
  public declare ability: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  static associate() {
    Role.hasMany(User, {
      foreignKey: 'role_id',
      as: 'users', 
    });
  }
}

Role.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  ability: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    set(value: string) {
      this.setDataValue('ability', value.toLowerCase());
    }
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
  tableName: 'roles',
  timestamps: true,
  underscored: true,
  modelName: 'Role'
});

export default Role;