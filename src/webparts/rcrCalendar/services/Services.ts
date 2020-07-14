import Service, { PagedService } from './Service';
import User from '../Models/User';
// import DictKindStructRealtySubj from '../models/Dictionary/DictKindStructRealtySubj';

const UserService = new Service<User>('users/');

export {
    UserService,
};
