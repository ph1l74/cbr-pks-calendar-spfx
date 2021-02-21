export const ConvertDateWithoutZone = (date: Date) => {
    // const formatDate = moment(date).zone(0).format('YYYY-MM-DDTHH:mm:ssZ');
    // return new Date(formatDate);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return date;
};