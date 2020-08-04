import Service, { PagedService } from './Service';
import User from '../Models/User';
import GroupingEvent from '../Models/GroupingEvent';
import Category from '../Models/Category';
import Comment from '../Models/Comment';
import Event from '../Models/Event';
// import DictKindStructRealtySubj from '../models/Dictionary/DictKindStructRealtySubj';

const UserService = new Service<User>('users/');
const GroupingEventService = new Service<GroupingEvent>('events/');
const EventService = new Service<Event>('events/');
const CategoryService = new Service<Category>('categories/');
const CommentService = new Service<Comment>('comments/');
const AttachmentService = new Service<any>('attachments/');

export {
    UserService, GroupingEventService, CategoryService, CommentService, EventService, AttachmentService
};