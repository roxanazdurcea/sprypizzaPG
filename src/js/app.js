// Init F7 Vue Plugin
window.Vue.use(Framework7Vue);

// Init Page Components
Vue.component('page-about', {
    template: '#page-about'
});

Vue.component('page-home', {
    template: '#page-home'
});

Vue.component('page-form', {
    template: '#page-form'
});

//page-menu
import groupscontainer from "../vues/menu/groups.vue";
import itemscontainer from "../vues/menu/items.vue";
Vue.component('page-menu', {
    template: '#page-menu',
    computed: {
        cartActive: function () {
            return Store.state.cartActive;
        }
    },
    components: {
        groupscontainer,
        itemscontainer
    }
});

//cart-menu
import shoppingcart from "../vues/cart/cart.vue";

Vue.component('page-cart', {
    template: '#page-cart',
    components: {
        shoppingcart
    }
});


//checkout-menu
import checkoutCart from "../vues/checkout/checkout.vue";
import addressesListing from "../vues/checkout/addresses.vue";
import addressTemplate from "../vues/register/address.vue";
import Gmap from "../vues/generic/map/map.vue";

Vue.component('page-checkout', {
    template: '#page-checkout',
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

    mounted: function () {
        //Addresses
        this.GetAddresses();
        this.GetClosestBranch();
        //Initiate Map
        let data = {'latitude': this.current_latitude, 'longitude': this.current_longitude, 'info': 'Current location'};
        Events.$emit('mapInfo-ev', data);
        //Set Order Address
        Events.$on('setOrderAddress-ev', function (address) {
            this.latitude = address.latitude;
            this.longitude = address.longitude;
            this.address = address.street + ', ' + address.city;
            let data = {'latitude': address.latitude, 'longitude': address.longitude, 'info': this.address};
            Events.$emit('mapInfo-ev', data);
        }.bind(this));

        Events.$on('saveAddress-ev', function (address) {

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
        Gmap
    }
});


// Init App
new Vue({
    el: '#app',
    // Init Framework7 by passing parameters here
    framework7: {
        root: '#app',
        /* Uncomment to enable Material theme: */
        // material: true,
        routes: [
            {
                path: '/',
                component: 'page-home'
            },
            {
                path: '/about/',
                component: 'page-about'
            },
            {
                path: '/form/',
                component: 'page-form'
            },
            {
                path: '/menu/',
                component: 'page-menu'
            },
            {
                path: '/cart/',
                component: 'page-cart'
            },
            {
                path: '/checkout/',
                component: 'page-checkout'
            }
        ],
    }
});