


<template>
    <div class="addressContainer">
        <div class="addressHead">
            <div class="title">My Addresses</div>
            <div class="addAddress" v-on:click="showAddressTemplate()">
                <i class="f7-icons size-15">add_round_fill</i>
            </div>
        </div>
        <div v-if=" addresses.length == 0 " style="padding-bottom: 5px !important; margin-bottom: 0!important;">
            <div class="addressAlert">
                <span><i class="f7-icons size-15" style="color: #FAFAFA;">info_fill</i></span>&nbsp;&nbsp;
                <span style="text-align:center; font-size: 12px;">No addresses are defined</span>
            </div>
        </div>
        <div v-for="(address, idx) in addresses" class="form-group" style="padding-bottom: 5px !important; margin-bottom: 0!important;">
            <div class="addressBox" @click="SetOrderAddress(address)">
                <select class="addressLabel" v-model="address.label" v-bind:disabled="disabled">
                    <option v-for="label in labels" v-bind:value="label">{{ label | capitalize }}</option>
                </select>
                <div class="addressDetails">{{ address.street }},&nbsp;{{ address.city }},&nbsp;{{ address.postalcode }},&nbsp;{{ address.state }}</div>
                <div class="addressDefault">
                    <i class="f7-icons size-15">{{ (address.default == 1) ? 'star_fill' : 'star' }}</i>
                    <!--<i class="fa fa-lg" v-bind:class="[ (address.default == 1) ? 'fa-star':'fa-star-o' ]"></i>-->
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
                labels: ['home', 'work', 'other'],
                selected: []
            }
        },
        filters: {
            capitalize: function(value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        methods: {
            SetOrderAddress: function(address) {
                Events.$emit('setOrderAddress-ev', address);
            },
            showAddressTemplate: function() {
                Events.$emit('showAddressTemplate-ev');
            }
        }
    }
</script>

<style scoped>

    /*.addressContainer {*/
        /*background-color: white;*/
        /*padding: 5px 10px 5px 10px;*/
        /*border: 1px solid #ccc;*/
    /*}*/

    .addressHead {
        display: flex;
        flex-direction: row;
        /*height: 40px;*/
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
        /*width: 100%;*/
        /*padding: 10px;*/
        min-height: 35px;
        padding:5px;
    }

    /*.addressBox:hover {*/
        /*background-color: #cccccc !important;*/
        /*!*width: 100%;*!*/
        /*padding: 10px;*/
        /*!*cursor: pointer;*!*/
    /*}*/

    .addressLabel {
        float: left;
        background-color: #F9A153 !important;
        /*width: 60px;*/
        text-align: center;
        font-size: 0.7rem !important;
        color: #FAFAFA;
    }

    .addressDetails {
        float: left;
        margin-left: 2%;
        font-size: 0.70rem !important;
        width: 75%;
    }

    .addressDefault {
        float: right;
        font-size: 0.70rem !important;
    }

    /*.addressDefault i:nth-child(1) {*/
        /*color: #F9A153;*/
        /*cursor: pointer;*/
        /*width:5%;*/

    /*}*/

    /*.addressDefault i:nth-child(2) {*/
        /*margin-left: 5px;*/
        /*color: #2e3436;*/
        /*cursor: pointer;*/
    /*}*/
</style>