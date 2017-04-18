import accountForm from "../../vues/account/form.vue";

new Vue({
    el: '#account-container',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    mounted: function() {
        var latitude = Cookies.Get('latitude');
        var longitude = Cookies.Get('longitude');
        var data = {'latitude': latitude, 'longitude': longitude, 'info': 'Current location'};
        Events.$emit('mapInfo-ev', data);
    },
    components: {
        accountForm
    }

})