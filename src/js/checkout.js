import checkoutCart from "../vues/checkout/checkout.vue";
import addressesListing from "../vues/checkout/addresses.vue";
import addressTemplate from "../vues/register/address.vue";
import Gmap from "../vues/generic/map/map.vue";

//Cart instance
new Vue({
    el: "#checkout-container",
    data: {
        addresses: [],
        address: '',
        branch_id: '',
        latitude: '',
        longitude: '',
        disabled: true
    },
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    methods: {
        GetClosestBranch() {
            this.$http.post('https://sprypizza.com/api/branches/get/closest', {
                latitude: this.latitude,
                longitude: this.longitude
            }).then(function(data) {
                if(data.body.response) {
                    var response = data.body.response;
                    this.branch_id = response.branch_id;
                } else {
                    var modalData = {
                        showModal: true,
                        modalTitle: "Warning !",
                        modalMessage: `Your order cannot be processed at this moment.`
                    };
                    Events.$emit('modalPopup-ev', modalData);
                }
            });
        },
        GetAddresses() {
            this.$http.post('https://sprypizza.com/api/addresses/get', {
                contact_id: '58c0312521a1d'
            }).then(function(data) {
                var response = data.body.response;
                this.addresses = response;
            });
        }
    },
    components: {
        checkoutCart,
        addressesListing,
        Gmap,
        addressTemplate
    },
    mounted: function() {
        //Addresses
        this.GetAddresses();
        //Coordinates
        let latitude = '44.4267674';
        let longitude = '26.1025384';
        //Get Closest Branch
        this.latitude = latitude;
        this.longitude = longitude;
        this.GetClosestBranch();
        //Initiate Map
        let data = {'latitude': latitude, 'longitude': longitude, 'info': 'Current location'};
        Events.$emit('mapInfo-ev', data);
        //Set Order Address
        Events.$on('setOrderAddress-ev', function(address) {
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
    }
});
