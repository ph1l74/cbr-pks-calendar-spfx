export default {
    API_URL: window.location.hostname !== 'localhost'
        ? 'http://' + window.location.hostname + ':' + '8080' + '/api/'
        : 'https://localhost:44393/api/',
    //API_URL: 'http://localhost:8080/resource/',

};
