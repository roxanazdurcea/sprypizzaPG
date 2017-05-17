<template>
    <div class="addressContainer">
        <div class="addressHead">
            <div class="title">My Addresses</div>
            <div class="addAddress" v-on:click="ShowAddressTemplate()" :disabled="disabled" v-show="!disabled">
                <i class="f7-icons size-15">add_round_fill</i>
            </div>
        </div>
        <div v-if=" addresses.length == 0 " style="padding-bottom: 5px !important; margin-bottom: 0!important;">
            <div class="addressAlert">
                <span><i class="f7-icons size-15" style="color: #FAFAFA; !important;">info_fill</i></span>&nbsp;&nbsp;
                <span style="text-align:center; font-size: 12px;">No addresses are defined</span>
            </div>
        </div>
        <div v-for="(address, idx) in addresses" style="padding-bottom: 5px !important; margin-bottom: 0!important;">
            <div class="addressBox" @click="ShowOnMap(address)">
                <select class="addressLabel" v-model="address.label" v-bind:disabled="disabled" v-on:change="SetDefaultAddress(idx)">
                    <option v-for="label in labels" v-bind:value="label">{{ label | capitalize }}</option>
                </select>
                <div class="addressDetails">{{ address.street }},&nbsp;{{ address.city }},&nbsp;{{ address.postalcode }},&nbsp;{{ address.state }}
                </div>
                <div class="addressDefault">
                    <!--<i class="fa fa-lg" v-bind:class="[ (address.default == 1) ? 'fa-star':'fa-star-o' ]" v-on:click="SetDefaultAddress(idx)" v-bind:disabled="disabled"></i>-->
                    <i class="f7-icons size-15" v-on:click="SetDefaultAddress(idx)" v-bind:disabled="disabled">{{ (address.default == 1) ? 'star_fill' : 'star' }}</i>
                    <!--<i class="fa fa-trash-o fa-lg" v-on:click="DeleteAddress(idx)" v-bind:disabled="disabled"></i>-->
                    <i class="f7-icons size-15" v-on:click="DeleteAddress(idx)" v-bind:disabled="disabled">trash_fill</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'addressesListing',
        props: ['addresses', 'disabled'],
        data: function () {
            return {
                labels: ['home', 'work', 'other']
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
            SetDefaultAddress: function (idx) {
                Events.$emit('setDefaultAddress-ev', idx);
            },
            DeleteAddress: function (idx) {
                Events.$emit('deleteAddress-ev', idx);
            },
            ShowAddressTemplate: function () {
                Events.$emit('showAddressTemplate-ev');
            },
            ShowOnMap: function (address) {
                let data = {
                    'latitude': address.latitude,
                    'longitude': address.longitude,
                    'info': address.street + ', ' + address.city
                };
                Events.$emit('mapInfo-ev', data);
            }
        }
    }
</script>

<style scoped>



    .addressHead {
        display: flex;
        flex-direction: row;
        padding:5px;
        background-color: #e5e5e5;
        margin: 5px 0 5px 0;
    }

    .addressHead .title {
        color: #D12027;
        float: left;
        font-weight: bold;
        display: flex;
        align-items: center;
        width: 95%;
    }

    .addressHead .addAddress {
        display: flex;
        align-items: center;
        width: 5%;
    }

    .addressHead .addAddress i {
        display: flex;
        align-items: center;
        color: #D12027 !important;
        cursor: pointer;
    }

    .addressAlert {
        height: 39px;
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
        min-height: 35px;
        padding: 5px;
    }

    .addressBox:after {
        clear: both;
        content: "";
        display: block;
    }

    .addressLabel {
        float: left;
        background-color: #F9A153 !important;
        text-align: center;
        font-size: 0.7rem !important;
        color: #FAFAFA;
        width: 20% !important;
    }

    .addressDetails {
        float: left;
        margin-left: 2%;
        font-size: 0.70rem !important;
        width: 68%;
    }

    .addressDefault {
        float: right;
        font-size: 0.70rem !important;
        width: 10%;
    }


</style>