import accountForm from "../vues/account/form.vue";

new Vue({
    el: '#account-container',
    computed: {
        current_latitude() {
            return Store.state.latitude;
        },
        current_longitude() {
            return Store.state.longitude;
        }
    },
    mounted: function () {
        var data = {'latitude': this.current_latitude, 'longitude': this.current_longitude, 'info': 'Current location'};
        Events.$emit('mapInfo-ev', data);
    },
    components: {
        accountForm
    }

})