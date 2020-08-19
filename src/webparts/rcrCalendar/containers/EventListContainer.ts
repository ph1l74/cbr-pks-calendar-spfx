import { connect } from 'react-redux';
import { toggleTodo } from '../Actions';
import RcrCalendarApp from '../components/RcrCalendarApp';
import { VisibilityFilters } from '../Actions';

const getEvents = (records: Event[], filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return records;
    case VisibilityFilters.SHOW_COMPLETED:
      return records; //.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return records; //.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter);
  }
};

const mapStateToProps = state => ({
  todos: getEvents(state.events, state.visibilityFilter)
});

const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(RcrCalendarApp);