<template>
    <div>
        <br />
        <div v-show="showTemplate">
            <p style="color: #FAFAFA; font-size: 12px; padding:5px; background-color: #d12027;">Pick your location on the map</p>

                <select class="form-control" v-model="template.label">
                    <option v-for="label in labels" v-bind:value="label">
                        {{ label | capitalize }}
                    </option>
                </select>

                <input class="form-control input-sm" placeholder="Street" type="text" v-model="template.street">

                <input class="form-control input-sm" placeholder="City" type="text" v-model="template.city">

                <input class="form-control input-sm" placeholder="Postalcode" type="text" v-model="template.postalcode">

                <input class="form-control input-sm" placeholder="State" type="text" v-model="template.state">

                <select name="country" class="form-control" v-model="template.country_id">
                    <option v-for="country in countries" v-bind:value="country.phonecode">
                        {{ country.nicename }}
                    </option>
                </select>

            <p class="col-50" v-on:click="SaveAddress()">
                <a href="#" class="button button-big color-orange">Save address</a>
            </p>

        </div>
    </div>
</template>

<script>

    export default {
        name: 'addressTemplate',
        data: function() {
            return {
                showTemplate: false,
                labels: ['home', 'work', 'other'],
                template: {
                    'label': 'home',
                    street: '',
                    city: '',
                    state: '',
                    postalcode: '',
                    country: 'Romania',
                    country_id: '40',
                    'latitude': '',
                    'longitude': '',
                    'default': '0'
                },
                countries: []
            }
        },
        filters: {
            capitalize: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        methods: {
            Countries: function() {
                axios({
                    method: 'POST',
                    url:'https://sprypizza.com/api/countries',
                    data: {},
                    responseType: 'json'
                }).then(data => {
                    this.countries = data.data.response;
                });
            },
            AddAddress: function() {
                this.showTemplate = true;
            },
            SaveAddress: function() {
                //Read Country value
                var selector = document.getElementsByName('country')[0];
                this.template.country = selector.options[selector.selectedIndex].text;

                Events.$emit('saveAddress-ev', this.template);
                this.showTemplate = false;
                this.template = {'label': 'home', street: '', city: '', state: '', postalcode: '', country: 'Romania', country_id: '40', country: 'Romania', 'latitude': '', 'longitude': '', 'default': '0'};
            }
        },
        mounted: function() {
            this.Countries();

            Events.$on('showAddressTemplate-ev', function() {
                this.showTemplate = true;
            }.bind(this));

            Events.$on('setAddress-ev', function(data) {

                var template = {
                    label: 'other',
                    street: data.address_components.street_number + ' ' + data.address_components.route,
                    city: data.address_components.locality,
                    state: data.address_components.administrative_area_level_1 || data.address_components.administrative_area_level_2,
                    postalcode: data.address_components.postal_code,
                    country: data.address_components.country,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    default: '0'
                };

                var country = data.address_components.country;

                axios.post('https://sprypizza.com/api/countries/id', {
                    country: country
                }).then(function(data) {
                    template.country_id = data.data.response;
                    this.template = template;
                    this.showTemplate = true;
                }.bind(this));

            }.bind(this));
        }
    }
</script>

