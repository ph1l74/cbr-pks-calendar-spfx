export default {
    API_URL: window.location.hostname !== 'localhost'
        ? 'http://' + window.location.hostname + ':' + '85' + '/api/'
        //? 'http://localhost:85/api/'
        : 'http://localhost:85/api/',
    //API_URL: 'http://localhost:8080/resource/',

};
