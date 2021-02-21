import Category from '../Models/Category';
import Comment from '../Models/Comment';
import Event from '../Models/Event';
import GroupingEvent from '../Models/GroupingEvent';
import User from '../Models/User';
import Service from './Service';
// import DictKindStructRealtySubj from '../models/Dictionary/DictKindStructRealtySubj';

const UserService = new Service<User>('users/');
const GroupingEventService = new Service<GroupingEvent>('events/');
const EventService = new Service<Event>('events/');
const CategoryService = new Service<Category>('categories/');
const CommentService = new Service<Comment>('comments/');
const AttachmentService = new Service<any>('attachments/');
const MaterialService = new Service<any>('materials/');
const ActorService = new Service<any>('actors/');
const CalendarService = new Service<string>('calendar/');

// tslint:disable-next-line: max-line-length
export { UserService, GroupingEventService, CategoryService, CommentService, EventService, AttachmentService, MaterialService, ActorService, CalendarService, };

