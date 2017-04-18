<template>
    <div class="panel panel-default addressContainer">
        <div class="panel-heading addressHead">
            <div class="col-xs-6 title">My Addresses</div>
            <div class="col-xs-6 addAddress" v-on:click="ShowAddressTemplate()" :disabled="disabled" v-show="!disabled">
                <i class="fa fa-plus-circle"></i>
            </div>
        </div>
        <div class="form-group" v-if=" addresses.length == 0 " style="padding-bottom: 5px !important; margin-bottom: 0!important;">
            <div class="addressAlert">
                <span><i class="fa fa-exclamation-circle" style="color: #FAFAFA; font-size: 12px;"></i></span>&nbsp;&nbsp;
                <span style="text-align:center; font-size: 12px;">No addresses are defined</span>
            </div>
        </div>
        <div v-for="(address, idx) in addresses" class="form-group" style="padding-bottom: 5px !important; margin-bottom: 0!important;">
            <div class="container addressBox" @click="ShowOnMap(address)">
                <select class="addressLabel" v-model="address.label" v-bind:disabled="disabled" v-on:change="SetDefaultAddress(idx)">
                    <option v-for="label in labels" v-bind:value="label">{{ label | capitalize }}</option>
                </select>
                <div class="addressDetails">{{ address.street }},&nbsp;{{ address.city }},&nbsp;{{ address.postalcode }},&nbsp;{{ address.state }}</div>
                <div class="addressDefault">
                    <i class="fa fa-lg" v-bind:class="[ (address.default == 1) ? 'fa-star':'fa-star-o' ]" v-on:click="SetDefaultAddress(idx)" v-bind:disabled="disabled"></i>
                    <i class="fa fa-trash-o fa-lg" v-on:click="DeleteAddress(idx)" v-bind:disabled="disabled"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'addressesListing',
        props: ['addresses', 'disabled'],
        data: function() {
            return {
                labels: ['home', 'work', 'other']
            }
        },
        filters: {
            capitalize: function(value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        methods: {
            SetDefaultAddress: function(idx) {
                Events.$emit('setDefaultAddress-ev', idx);
            },
            DeleteAddress: function(idx) {
                Events.$emit('deleteAddress-ev', idx);
            },
            ShowAddressTemplate: function() {
                Events.$emit('showAddressTemplate-ev');
            },
            ShowOnMap: function(address) {
                let data = {'latitude': address.latitude, 'longitude': address.longitude, 'info': address.street + ', ' + address.city};
                Events.$emit('mapInfo-ev', data);
            }
        }
    }
</script>

<style scoped>

    .addressContainer {
        background-color: white;
        padding: 10px;
        border: 1px solid #ccc;
    }

    .addressHead {
        display: flex;
        flex-direction: row;
        height: 40px;
        background-color: #e5e5e5;
        margin: 5px 0 5px 0;
    }

    .addressHead .title {
        color: #D12027;
        float: left;
        font-weight: bold;
        display: flex;
        align-items: center;
    }

    .addressHead .addAddress {
        display: flex;
        align-items: center;
    }

    .addressHead .addAddress i {
        display: flex;
        align-items: center;
        margin-left:95%;
        color: green;
        cursor: pointer;
    }

    .addressAlert {
        height: 39px;
        width: 100%;
        margin: 0 auto;
        padding: 0 10px 0 10px;
        color: #FAFAFA;
        background-color: #D12027;
        text-align: center;
        display: flex;
        align-items: center;
    }

    .addressBox {
        background-color: #f1f1f1 !important;
        width: 100%;
        padding: 10px;
    }

    .addressBox:hover {
        background-color: #cccccc !important;
        width: 100%;
        padding: 10px;
        cursor: pointer;
    }

    .addressLabel {
        float: left;
        background-color: #F9A153;
        width: 60px;
        text-align: center;
        font-size: 1.0rem !important;
        color: #FAFAFA;
    }

    .addressDetails {
        float: left;
        margin-left: 2%;
        font-size: 0.90rem !important;
        width: 75%;
    }

    .addressDefault {
        float: right;
        margin-left: 2%;
        font-size: 1.1rem !important;
    }

    .addressDefault i:nth-child(1) {
        color: orange;
        cursor: pointer;
    }

    .addressDefault i:nth-child(2) {
        margin-left: 5px;
        color: #2e3436;
        cursor: pointer;
    }
</style>