<template>

    <form id="register_Form">

        <div class="row">
            <p class="col-50" v-on:click="Edit" v-bind:class="[ (disabled) ? 'btn-warning' : 'btn-danger' ]">
                <a href="#" class="button button-big color-red">{{ (disabled) ? "Edit" : "Cancel" }}</a>
            </p>
            <p class="col-50" v-on:click="Update" v-bind:disabled="isDisabled || disabled">
                <a href="#view-4" class="tab-link button button-big color-orange">Update</a>
            </p>
        </div>

        <div class="form-group" v-bind:class="{ 'has-error' : contact.first_nameError }">
            <div class="input-group">
                <div>
                    <select class="form-control" v-model="contact.title" :disabled="disabled">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                    </select>
                </div>
                <div>
                    <input class="form-control" type="text" name="first_name" placeholder="First Name" v-model="contact.first_name" v-on:blur="ValidateFirstName" :disabled="disabled">
                </div>
                <div>
                    <input class="form-control" type="text" name="last_name" placeholder="Last Name" v-model="contact.last_name" v-on:blur="ValidateLastName" :disabled="disabled">
                </div>
            </div>
            <div class="divError" v-show="nameError"><p>{{ contact.nameErrorMessage }}</p></div>
        </div>
        <div class="form-group">
            <div class='input-group date' id='datetimepicker'>
                <datepicker :inputClass="datepicker.inputClass" :placeholder="datepicker.placeholder" :format="datepicker.format" :disabled="disabled" v-model="contact.birthdate"></datepicker>
                <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
            </div>
        </div>
        <div v-for="email in contact.emails" class="form-group" v-bind:class="{ 'has-error' : contact.email }">
            <input class="form-control" type="text" name="email" placeholder="Email" v-model="email.email_address" v-on:blur="ValidateEmails" :disabled="disabled"/>
            <div class="divError" v-show="email.emailError"><p>The Email is required or already exist</p></div>
        </div>
        <div v-for="phone in contact.phones" class="form-group" v-bind:class="{ 'has-error' : contact.mobile }">
            <div class="input-group">
                <div class="input-group-btn">
                    <select class="form-control" placeholder="country" v-model="phone.country_id" :disabled="disabled">
                        <option v-for="country in countries" v-bind:value="country.phonecode">
                            {{ country.nicename }}
                        </option>
                    </select>
                </div>
                <input class="form-control" type="text" name="mobile" placeholder="Mobile Number" v-model="phone.number" v-on:blur="ValidatePhones" :disabled="disabled"/>
            </div>
            <div class="divError" v-show="phone.phoneError"><p>The phone number already exists or is in a wrong
                format</p></div>
        </div>

        <addresses-listing v-bind:addresses="contact.addresses" v-bind:disabled="disabled"></addresses-listing>

        <div>
            <Gmap :search="true" :zoom="14" :height="210" :event="true"></Gmap>
            <address-template></address-template>
        </div>
    </form>
</template>

<script>
    import moment from 'moment';
    import Gmap from "../generic/map/map.vue";
    import addressTemplate from "../register/address.vue";
    import addressesListing from "../register/addresses.vue";
    import Datepicker from '../generic/datepicker/Datepicker.vue';
    import modalAlert from "../generic/modal/modal.vue";

    export default {
        name: 'accountForm',
        data: function () {
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
                disabled: true,
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
            isDisabled: function () {
                if (this.contact.first_nameError || this.contact.last_nameError || this.contact.phones[0]['phoneError'] || this.contact.emails[0]['emailError']
                        || !this.contact.first_name || !this.contact.last_name || !this.contact.phones[0]['number'] || !this.contact.emails[0]['email_address']
                        || this.contact.addresses.length === 0) {
                    return true;
                } else {
                    return false;
                }
            },
            nameError: function () {
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
            }
        },
        filters: {
            capitalize: function (value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        methods: {
            Read: function () {
                return this.$http.post('https://sprypizza.com/api/contact/read', {
                    contact_id: "58c0312521a1d",
                }).then(function (data) {
                    var contact = data.body.response;
                    contact.first_nameError = false;
                    contact.last_nameError = false;
                    contact.nameErrorMessage = '';
                    contact.emails.map(function (email) {
                        email.emailError = false;
                        return email;
                    });
                    contact.phones.map(function (phone) {
                        phone.phoneError = false;
                        return phone;
                    });
                    contact.addresses.map(function (address) {
                        address.addressError = false;
                        return address;
                    });
                    this.contact = contact;
                }.bind(this));
            },
            ValidateFirstName: function () {
                this.$http.post('https://sprypizza.com/api/validate/firstname', {
                    first_name: this.contact.first_name,
                }).then(function (data) {
                    var results = data.body.response;
                    this.contact.first_nameError = (results.res_firstname) ? true : false;
                }.bind(this));
            },
            ValidateLastName: function () {
                this.$http.post('https://sprypizza.com/api/validate/lastname', {
                    last_name: this.contact.last_name,
                }).then(function (data) {
                    var results = data.body.response;
                    this.contact.last_nameError = (results.res_lastname) ? true : false;
                }.bind(this));
            },
            ValidatePhones: function () {
                this.$http.post('https://sprypizza.com/api/validate/phones', {
                    phones: this.contact.phones,
                    contact_id: "58c0312521a1d",
                }).then(function (data) {
                    var results = data.body.response;
                    results.res_phones.forEach(function (phoneError, index) {
                        this.contact.phones[index]['phoneError'] = (phoneError) ? true : false;
                    }.bind(this));
                }.bind(this));
            },
            ValidateEmails: function () {
                this.$http.post('https://sprypizza.com/api/validate/emails', {
                    emails: this.contact.emails,
                    contact_id: "58c0312521a1d",
                }).then(function (data) {
                    var results = data.body.response;
                    results.res_emails.forEach(function (emailError, index) {
                        this.contact.emails[index]['emailError'] = (emailError) ? true : false;
                    }.bind(this));
                }.bind(this));
            },
            Edit: function () {
                this.disabled = (this.disabled === true) ? false : true;
            },
            Update: function () {
                return this.$http.post('https://sprypizza.com/api/contact/update', {
                    contact_id: "58c0312521a1d",
                    title: this.contact.title,
                    first_name: this.contact.first_name,
                    last_name: this.contact.last_name,
                    birthdate: moment(this.contact.birthdate).format('YYYY-MM-DD'),
                    phones: this.contact.phones,
                    emails: this.contact.emails,
                    addresses: this.contact.addresses
                }).then(function () {
                    var modalData = {
                        showModal: true,
                        modalTitle: "Congratulations !",
                        modalMessage: "Your account was successfully updated"
                    };
                    Events.$emit('modalPopup-ev', modalData);
                    this.disabled = true;
                }.bind(this));
            },
            Countries: function () {
                return this.$http.post('https://sprypizza.com/api/countries', {}).then(function (data) {
                    this.countries = data.body.response;
                });
            },
            SetDefaultAddress: function (idx) {
                var selectedLabel = this.contact.addresses[idx]['label'];
                this.contact.addresses.forEach(function (address, index) {
                    if (address.label === selectedLabel) {
                        address.default = 0;
                        if (index === idx) {
                            address.default = 1;
                        }
                    }
                });
            }
        },
        mounted: function () {

            var promise = Promise.resolve();
            promise.then(function () {
                return this.Countries();
            }.bind(this)).then(function () {
                return this.Read();
            }.bind(this));

            Events.$on('saveAddress-ev', function (address) {

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
                this.SetDefaultAddress(len);
            }.bind(this));

            Events.$on('setDefaultAddress-ev', function (idx) {
                if (!this.disabled) {
                    this.SetDefaultAddress(idx);
                }
            }.bind(this));

            Events.$on('deleteAddress-ev', function (idx) {
                if (!this.disabled) {
                    this.contact.addresses.splice(idx, 1);
                }
            }.bind(this));
        },
        components: {
            Gmap,
            addressTemplate,
            addressesListing,
            Datepicker,
            modalAlert
        }
    }
</script>

<style scoped>

    #register_Form input, #register_Form select, #register_Form button {
        z-index: 0;
        width: 100%;
    }

    p {
        font-size: 0.6rem;
    }

</style>