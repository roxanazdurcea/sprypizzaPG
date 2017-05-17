<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>Checkout</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
        <f7-block inner>
            <section style="padding: 10px;">
                <div id="order-map">
                    <Gmap :zoom="14" :search="true" :event="true"></Gmap>
                </div>
                <div>
                    <address-template></address-template>
                </div>
                <div>
                    <addresses-listing :addresses="addresses" :disabled="disabled"></addresses-listing>
                </div><!-- addresses-container -->
                <br/>
                <div>
                    <checkout-cart :address="address" :latitude="latitude" :longitude="longitude" :branch_id="branch_id"></checkout-cart>
                </div>
            </section>
        </f7-block>

        <!-- Bottom Tabbar-->
        <div class="toolbar tabbar tabbar-labels toolbar-bottom">
            <div class="toolbar-inner bottom-padding">
                <a href="/" class="item-link"><i class="f7-icons">home</i><span class="tabbar-label">Home</span></a>
                <a href="/menu/" class="item-link"><i class="f7-icons">favorites</i><span class="tabbar-label">Menu</span></a>
                <a href="/cart/" class="item-link"><i class="f7-icons">bag</i><span class="tabbar-label">Cart</span><item-count></item-count></a>
                <a href="/track-order/" class="item-link"><i class="f7-icons">navigation_fill</i><span class="tabbar-label">Track</span></a>
            </div>
        </div>

    </f7-page>
</template>

<script>
    import checkoutCart from "./checkout.vue";
    import addressesListing from "./addresses.vue";
    import addressTemplate from "../register/address.vue";
    import Gmap from "../generic/map/map.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
    export default {
        name: 'pageCheckout',
        data() {
            return {
                addresses: [],
                address: '',
                branch_id: '',
                latitude: '',
                longitude: '',
                disabled: true
            }
        },
        computed: {
            contact_id() {
                return Store.state.contact_id;
            },
            current_latitude() {
                return Store.state.latitude;
            },
            current_longitude() {
                return Store.state.longitude;
            }
        },
        methods: {
            GetClosestBranch() {
                axios.post('https://sprypizza.com/api/branches/get/closest', {
                    latitude: this.current_latitude,
                    longitude: this.current_longitude
                }).then(data => {
                    if (data.data.response) {
                        var response = data.data.response;
                        this.branch_id = response.branch_id;
                    } else {
                        window.myApp.alert('Your order cannot be processed at this moment', 'Warning !');
                    }
                });
            },
            GetAddresses() {
                axios({
                    method: 'POST',
                    url: 'https://sprypizza.com/api/addresses/get',
                    data: {
                        contact_id: this.contact_id
                    },
                    responseType: 'json'
                }).then(data => {
                    this.addresses = data.data.response;
                });
            }
        },

        mounted: function() {
            //Addresses
            this.GetAddresses();
            this.GetClosestBranch();
            //Initiate Map
            let data = {'latitude': this.current_latitude, 'longitude': this.current_longitude, 'info': 'Current location'};
            Events.$emit('mapInfo-ev', data);
            //Set Order Address
            Events.$on('setOrderAddress-ev', function(address) {
                this.latitude = address.latitude;
                this.longitude = address.longitude;
                this.address = address.street + ', ' + address.city;
                let data = {'latitude': address.latitude, 'longitude': address.longitude, 'info': this.address};
                Events.$emit('mapInfo-ev', data);
            }.bind(this));

            Events.$on('saveAddress-ev', function(address) {

                var len = this.addresses.length;

                Vue.set(this.addresses, len, {
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

                this.latitude = address.latitude;
                this.longitude = address.longitude;
                this.address = address.street + ', ' + address.city;

            }.bind(this));
        },
        components: {
            checkoutCart,
            addressesListing,
            addressTemplate,
            Gmap,
            loginIcon,
            itemCount
        }
    }
</script>