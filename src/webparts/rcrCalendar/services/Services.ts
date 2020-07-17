import Service, { PagedService } from './Service';
import User from '../Models/User';
import GroupingEvent from '../Models/GroupingEvent';
// import DictKindStructRealtySubj from '../models/Dictionary/DictKindStructRealtySubj';

const UserService = new Service<User>('users/');
const EventService = new Service<GroupingEvent>('events/');

export {
    UserService, EventService,
};