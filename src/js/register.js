import registerForm from "../../vues/register/form.vue";

new Vue({
    el: "#register-container",
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    mounted: function() {
        var latitude = Cookies.Get('latitude') || '44.4267674';
        var longitude = Cookies.Get('longitude') || '26.1025384';
        var data = {'latitude': latitude, 'longitude': longitude, 'info': 'Current location'};
        Events.$emit('mapInfo-ev', data);
    },
    components: {
        registerForm
    }
});