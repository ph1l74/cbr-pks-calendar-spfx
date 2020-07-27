import Service, { PagedService } from './Service';
import User from '../Models/User';
import GroupingEvent from '../Models/GroupingEvent';
import Category from '../Models/Category';
import Comment from '../Models/Comment';
// import DictKindStructRealtySubj from '../models/Dictionary/DictKindStructRealtySubj';

const UserService = new Service<User>('users/');
const EventService = new Service<GroupingEvent>('events/');
const CategoryService = new Service<Category>('categories/');
const CommentService = new Service<Comment>('comments/');

export {
    UserService, EventService, CategoryService, CommentService,
};