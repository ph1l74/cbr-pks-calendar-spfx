import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import Dashboard from './Dashboard';
import Content from './Content';
import Calendar from './Calendar';
import EventCard from './EventCard';
import { EventService } from '../services/Services';
import GroupingEvent from '../Models/GroupingEvent';
import Event from '../Models/Event';
import { sp } from '@pnp/sp/presets/all';
import pnp from 'sp-pnp-js';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/sites";
import { IContextInfo } from "@pnp/sp/sites";
import { connect } from 'react-redux'
import { changeCalendarDate } from '../Actions';
import Categories from './Categories';
import { useSelector } from 'react-redux';
import EditFormCard from './EditFormCard';
import Category from '../Models/Category';

const RcrCalendarApp = (events: GroupingEvent[], setDateChange: (date: Date) => void) => {
    const editMode = useSelector(state => state.root.editMode);
    //const [events, setEvents] = React.useState([]);

    // const filterSelectedDay = async (selectedDay: Date) => {
    //     // sp.setup({
    //     //     sp: {
    //     //         baseUrl: "http://sp2019/",
    //     //         headers: {
    //     //             Accept: "application/json;odata=verbose"
    //     //         }
    //     //     }
    //     // });
    //     // sp.setup({
    //     //     spfxContext: this.context
    //     // });

    //     // console.log('payload', sp);
    //     // console.log('fetch', pnp.sp.web.currentUser);
    //     let web = pnp.sp.site.rootWeb;
    //     console.log(web.toUrlAndQuery());
    //     try {
    //         const oContext: IContextInfo = await sp.site.getContextInfo();
    //         const siteUrl = oContext.SiteFullUrl;
    //         console.log(siteUrl);
    //         pnp.setup({ sp: { baseUrl: siteUrl } });
    //         let curruser = await pnp.sp.utility.getCurrentUserEmailAddresses();
    //         console.log(curruser);
    //         // let curProp = await pnp.sp.profiles.myProperties.get();
    //         // console.log(curProp);
    //         //let curruser = await sp.web.currentUser.get();
    //         //console.log(curruser.Email, curruser.Id, curruser.LoginName, curruser.Title, curruser.UserId, curruser.UserPrincipalName);

    //         web.currentUser.get().then(res => console.log(res)).catch(err => console.log(err));
    //     }
    //     catch (ex) {
    //         console.log(ex);
    //     }
    //     // // pnp.sp.profiles.myProperties.get()
    //     // //     .then(userprops => {
    //     // //         console.log(userprops);
    //     // //     });
    //     // //     let curruser = pnp.sp.utility.getCurrentUserEmailAddresses();
    //     // //     curruser.then(function(res){ 
    //     // //         console.log(res); });
    //     // EventService.searchGet(`/?startDate=${selectedDay.getDate()}.0${selectedDay.getMonth()}.${selectedDay.getFullYear()}`)
    //     //     .then(evts => setEvents(evts))
    //     //     .catch(err => console.log(err));
    //     // /*console.log(events);
    //     // events.map((ob) => (
    //     //     console.log(ob.key)
    //     //   )
    //     // );*/
    // }

    const renderEvents = (events: any) => {
        console.log('render events', events);
        return events.events.map(evg => {
            const evGr = evg as GroupingEvent;
            // console.log(evGr.Value);
            return (evGr.Value).map(ev => <EventCard eventCard={ev}></EventCard>);
        });
    }

    const initCategories: Category[] = [];
    return (
        editMode && editMode === 1 ?
            <EditFormCard></EditFormCard>
            :
            (
                <div className={styles.app}>
                    <Content>
                        {renderEvents(events)}
                    </Content>
                    <Dashboard>
                        <Calendar ></Calendar>
                        <Categories categories = {initCategories}/>
                    </Dashboard>
                </div>
            )
    );
}


const mapStateToProps = (store: any) => {
    console.log(store.event);
    return {
        events: store.event.events
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // setDate: year => dispatch(changeCalendarDate(year)) // [1]
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RcrCalendarApp)
