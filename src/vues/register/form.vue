<template>

    <form id="register_Form">
        <ul>
            <div>

                <li class="item-content">
                    <div class="item-inner">
                        <div class="item-input form-group" v-bind:class="{ 'has-error' : contact.first_nameError }">

                            <select class="form-control" v-model="contact.title">
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                            </select>

                            <input class="form-control" type="text" name="first_name" placeholder="First Name" v-model="contact.first_name" v-on:blur="ValidateFirstName">

                            <input class="form-control" type="text" name="last_name" placeholder="Last Name" v-model="contact.last_name" v-on:blur="ValidateLastName">

                            <div class="divError" v-show="nameError"><p>{{ contact.nameErrorMessage }}</p></div>

                        </div>
                    </div>
                </li>


                <li class="item-content">
                    <div class="item-inner">
                        <div class="item-input form-group">
                            <div class="date" id="datetimepicker">
                                <datepicker :inputClass="datepicker.inputClass" :placeholder="datepicker.placeholder" :format="datepicker.format" v-model="contact.birthdate"></datepicker>
                                <!--<span><i class="f7-icons size-15">calendar_fill</i></span>-->
                            </div>
                        </div>
                    </div>
                </li>


                <li class="item-content">
                    <div class="item-inner">
                        <div class="item-input form-group " v-for="email in contact.emails" v-bind:class="{ 'has-error' : contact.email }">
                            <input class="form-control" type="text" name="email" placeholder="Email" v-model="email.email_address" v-on:blur="ValidateEmails"/>
                            <div class="divError" v-show="email.emailError"><p>The Email is required or already exist</p></div>
                        </div>
                    </div>
                </li>

                <li class="item-content">
                    <div class="item-inner">
                        <div class="item-input form-group " v-for="email in contact.emails" v-bind:class="{ 'has-error' : contact.email }">
                            <div v-for="phone in contact.phones" class="form-group" v-bind:class="{ 'has-error' : contact.mobile }">

                                <select class="form-control" placeholder="country" v-model="phone.country_id">
                                    <option v-for="country in countries" v-bind:value="country.phonecode">
                                        {{ country.nicename }}
                                    </option>
                                </select>

                                <input class="form-control" type="text" name="mobile" placeholder="Mobile Number" v-model="phone.number" v-on:blur="ValidatePhones"/>

                                <div class="divError" v-show="phone.phoneError"><p>The phone number already exists or is in a wrong format</p></div>
                            </div>
                        </div>
                    </div>
                </li>

                <li class="item-content">
                    <div class="item-inner">
                        <div class="item-input form-group">
                            <button type="button" class="button button-big color-orange" style="width: 100%;"  v-on:click.once="Submit" v-bind:disabled="isDisabled">
                                Create Account
                            </button>
                        </div>
                    </div>
                </li>

                <address-template></address-template>



                <li class="item-content">
                    <div class="item-inner">
                        <div class="item-input form-group" v-show="showPIN">
                            <div>
                                <input placeholder="PIN" type="text" class="form-control" name="pin" v-model="pin"/>
                                <span><button class="button button-big color-orange" type="button" v-on:click="ActivateContact">Activate</button></span>
                            </div>
                            <div class="divError">
                                <p>{{ validationMessage }}</p>
                            </div>
                        </div>
                    </div>
                </li>

            </div>
            <div>
                <Gmap :search="true" :zoom="14" :height="210" :event="true"></Gmap>
                <addresses-listing v-bind:addresses="contact.addresses"></addresses-listing>
            </div>
        </ul>
    </form>

</template>

<script>
    import moment from 'moment';
    import Gmap from "../generic/map/map.vue";
    import addressTemplate from "./address.vue";
    import addressesListing from "./addresses.vue";
    import Datepicker from '../generic/datepicker/Datepicker.vue';

    export default {
        name: 'registerForm',
        data() {
            return {
                contact: {
                    title: 'Mr',
                    first_name: '',
                    first_nameError: false,
                    last_name: '',
                    last_nameError: false,
                    nameErrorMessage: '',
                    birthdate: '',
                    phones: [{number: '', phoneError: false, country_id: '40', label: 'mobile', default: '1'}],
                    emails: [{email_address: '', emailError: false, label: 'personal', default: '1'}],
                    addresses: []
                },
                pin: '',
                showPIN: false,
                validated: false,
                readonly: false,
                validationMessage: '',
                countries: [],
                datepicker: {
                    inputClass: "form-control",
                    placeholder: "Birthdate",
                    format: "yyyy-MM-dd"
                }

            }
        },
        computed: {
            isDisabled() {
                if (this.contact.first_nameError || this.contact.last_nameError || this.contact.phones[0]['phoneError'] || this.contact.emails[0]['emailError']
                        || !this.contact.first_name || !this.contact.last_name || !this.contact.phones[0]['number'] || !this.contact.emails[0]['email_address']
                        || this.contact.addresses.length === 0 || this.readonly) {
                    return true;
                } else {
                    return false;
                }
            },
            nameError() {
                if (this.contact.first_nameError && !this.contact.last_nameError) {
                    this.contact.nameErrorMessage = "The first name should be a minimum of 2 characters";
                    return true;
                } else if (!this.contact.first_nameError && this.contact.last_nameError) {
                    this.contact.nameErrorMessage = "The last name should be a minimum of 2 characters";
                    return true;
                } else if (this.contact.first_nameError && this.contact.last_nameError) {
                    this.contact.nameErrorMessage = "The first name and the last name should be a minimum of 2 characters";
                    return true;
                } else {
                    return false;
                }
            },
            current_latitude() {
                return Store.state.latitude;
            },
            current_longitude() {
                return Store.state.longitude;
            }
        },
        filters: {
            capitalize(value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        methods: {
            Submit() {
                if (!this.isDisabled) {
                    var promise = Promise.resolve();
                    promise.then(() => {
                        return this.Save();
                    }).then(() => {
                        this.readonly = true;
                        this.showPIN = true;
                    });
                }
            },
            ValidateFirstName() {
                axios.post('https://sprypizza.com/api/validate/firstname', {
                    first_name: this.contact.first_name,
                }).then(data => {
                    let results = data.data.response;
                    this.contact.first_nameError = (results.res_firstname) ? true : false;
                });
            },
            ValidateLastName() {
                axios.post('https://sprypizza.com/api/validate/lastname', {
                    last_name: this.contact.last_name,
                }).then(data => {
                    let results = data.data.response;
                    this.contact.last_nameError = (results.res_lastname) ? true : false;
                });
            },
            ValidatePhones() {
                axios.post('https://sprypizza.com/api/validate/phones', {
                    phones: this.contact.phones,
                }).then(data => {
                    var results = data.data.response;
                    results.res_phones.forEach((phoneError, index) => {
                        this.contact.phones[index]['phoneError'] = (phoneError) ? true : false;
                    });
                });
            },
            ValidateEmails() {
                axios.post('https://sprypizza.com/api/validate/emails', {
                    emails: this.contact.emails,
                }).then(data => {
                    var results = data.data.response;
                    results.res_emails.forEach((emailError, index) => {
                        this.contact.emails[index]['emailError'] = (emailError) ? true : false;
                    });
                });
            },
            Save() {
                return axios.post('https://sprypizza.com/api/contact/save', {
                    title: this.contact.title,
                    first_name: this.contact.first_name,
                    last_name: this.contact.last_name,
                    birthdate: moment(this.contact.birthdate).format('YYYY-MM-DD'),
                    phones: this.contact.phones,
                    emails: this.contact.emails,
                    addresses: this.contact.addresses
                }).then(data => {
                    this.validationMessage = data.data.response.pin || data.data.response.error;
                });
            },
            ActivateContact() {
                axios.post('https://sprypizza.com/api/contact/activate', {
                    pin: this.pin,
                    mobile: this.contact.phones[0].number,
                    country_id: this.contact.phones[0].country_id
                }).then(data => {
                    this.validationMessage = data.data.response.pin || data.data.response.error;
                    this.contact = {
                        title: 'Mr',
                        first_name: '',
                        first_nameError: false,
                        last_name: '',
                        last_nameError: false,
                        nameErrorMessage: '',
                        birthdate: '',
                        phones: [{number: '', phoneError: false, country_id: '40', label: 'mobile', default: '1'}],
                        emails: [{email: '', emailError: false, label: 'personal', default: '1'}],
                        addresses: []
                    };
                    document.getElementById('register_Form').reset();
                });
            },
            Countries() {
                axios.post('https://sprypizza.com/api/countries', {}).then(data => {
                    this.countries = data.data.response;
                });
            }
        },
        mounted() {
            this.Countries();

            Events.$on('saveAddress-ev', (address) => {

                var len = this.contact.addresses.length;

                Vue.set(this.contact.addresses, len, {
                    label: address.label,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalcode: address.postalcode,
                    country: address.country,
                    country_id: address.country_id,
                    latitude: address.latitude,
                    longitude: address.longitude,
                    default: address.default
                });
            });

            Events.$on('setDefaultAddress-ev', (idx) => {
                var selectedLabel = this.contact.addresses[idx]['label'];
                this.contact.addresses.forEach(function (address, index) {
                    if (address.label === selectedLabel) {
                        address.default = 0;
                        if (index === idx) {
                            address.default = 1;
                        }
                    }
                });
            });

            Events.$on('deleteAddress-ev', (idx) => {
                this.contact.addresses.splice(idx, 1);
            });

            var data = {'latitude': this.current_latitude, 'longitude': this.current_longitude, 'info': 'Current location'};
            Events.$emit('mapInfo-ev', data);
        },
        components: {
            Gmap,
            addressTemplate,
            addressesListing,
            Datepicker
        }
    }
</script>

<style scoped>
    #register_Form {
        width: 100%;
    }

    .divError p{
        color: darkred;
        font-size: 10px !important;
    }
</style>