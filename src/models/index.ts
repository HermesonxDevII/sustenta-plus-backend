import sequelize from '../config/database';
import { User } from './User';
import { Role } from './Role';
import { Status } from './Status';
import { Report } from './Report';
import { ReportPhoto } from './ReportPhoto';
import { Collection } from './Collection';
import { CollectionPhoto } from './CollectionPhoto';
import { UserCollection } from './UserCollection';

const setupAssociations = () => {
  User.associate();
  Role.associate();
  Status.associate();
  Report.associate();
  ReportPhoto.associate();
  Collection.associate();
  CollectionPhoto.associate();
  UserCollection.associate();
};

setupAssociations();

export {
  sequelize,
  User,
  Role,
  Status,
  Report,
  ReportPhoto,
  Collection,
  CollectionPhoto,
  UserCollection
};