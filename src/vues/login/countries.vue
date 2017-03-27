<template>
    <div class="item-input">
        <select name="country_id"  v-model="country_id" v-on:change="SetCountry()">
            <option v-for="country in countries" v-bind:value="country.phonecode">
                {{ country.nicename }}
            </option>
        </select>
    </div>
</template>

<script>
    export default {
        name: "countriesListing",
        data: function() {
            return {
                country_id: '40',
                countries: []
            }
        },
        methods: {
            Countries: function() {
                this.$http.post('https://sprypizza.com/api/countries', {}).then(function(data) {
                    this.countries = data.body.response;
                });
            },
            SetCountry: function() {
                Events.$emit('setCountry-ev', this.country_id);
            }
        },
        mounted: function() {
            this.Countries();
        }
    }
</script>