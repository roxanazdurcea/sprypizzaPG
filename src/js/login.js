import loginErrors from "../vues/login/errors.vue";
import countriesListing from "../vues/login/countries.vue";

new Vue({
    el: '#login_Form',
    data: {
        mobile: '',
        country_id: '40',
        isDisabled: false,
        pin: '',
        error: ''
    },
    methods: {
        Send() {
            axios.post('https://sprypizza.com/api/sms/send', {
                mobile: this.mobile,
                country_id: this.country_id
            }).then(function(data) {

                this.error = this.pin = '';

                if (data.data.error) {
                    this.error = data.data.error;
                }
                else if (data.data.pin) {
                    this.isDisabled = true;
                    this.pin = data.data.pin;
                }
            }.bind(this));
        }
    },
    mounted() {
        Events.$on('setCountry-ev', function(country_id) {
            this.country_id = country_id;
        }.bind(this));
    },
    components: {
        loginErrors,
        countriesListing
    },
});