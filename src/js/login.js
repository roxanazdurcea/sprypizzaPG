import loginErrors from "../vues/login/errors.vue";
import countriesListing from "../vues/login/countries.vue";

new Vue({
    el: '#login_Form',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    data: {
        mobile: '',
        country_id: '40',
        isDisabled: false,
        pin: '',
        error: ''
    },
    methods: {
        Send: function() {
            this.$http.post('https://sprypizza.com/api/sms/send', {
                mobile: this.mobile,
                country_id: this.country_id
            }).then(function(data) {

                this.error = this.pin = '';

                if (data.body.error) {
                    this.error = data.body.error;
                }
                else if (data.body.pin) {
                    this.isDisabled = true;
                    this.pin = data.body.pin;
                }
            }.bind(this));
        }
    },
    components: {
        loginErrors,
        countriesListing
    },
    mounted: function() {
        Events.$on('setCountry-ev', function(country_id) {
            this.country_id = country_id;
        }.bind(this));
    }
});