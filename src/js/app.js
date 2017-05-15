// Init F7 Vue Plugin
window.Vue.use(Framework7Vue);

window.myApp = new Framework7();

//home page
Vue.component('page-home', {
    template: '#page-home',
});

//footer and home page tracking block
import orderTracking from "../vues/tracking/footer.vue";
Vue.component('page-track-order', {
    template: '#page-track-order',
    components: {
        orderTracking
    }
});

//left panel
Vue.component('left-panel', {
    template: '#left-panel',
    computed: {
        isLoggedIn() {
            return Store.state.isLoggedIn;
        }
    }
});

//page-menu
import groupscontainer from "../vues/menu/groups.vue";
import itemscontainer from "../vues/menu/items.vue";
Vue.component('page-menu', {
    template: '#page-menu',
    computed: {
        cartActive: function() {
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


//all branches
import branches from "../vues/branches/branch.vue";

Vue.component('page-branches', {
    template: '#page-branches',
    components: {
        branches
    }
});

//closest branch
import closestBranch from "../vues/branches/closet-branch.vue";

Vue.component('page-branch', {
    template: '#page-branch',
    components: {
        closestBranch
    }
});


//login
import loginErrors from "../vues/login/errors.vue";
import countriesListing from "../vues/login/countries.vue";

Vue.component('page-login', {
    template: '#page-login',
    data() {
        return {
            mobile_number: '',
            pin_number: '',
            country_id: '40',
            isDisabled: false,
            pin: '',
            error: ''
        }
    },
    methods: {
        Send() {
            axios.post('https://sprypizza.com/api/sms/send', {
                mobile: this.mobile_number,
                country_id: this.country_id
            }).then(function(data) {

                this.error = this.pin = '';

                if (data.data.error) {
                    this.error = data.data.error;
                }
                else if (data.data.pin) {
                    this.isDisabled = true;
                    this.pin = data.data.pin;
                }
            }.bind(this));
        },
        Login() {

            axios.post("https://sprypizza.com/api/login", {
                mobile_number: this.mobile_number,
                country_id: this.country_id,
                pin_number: this.pin_number,
                rememberMe: true,
            }).then((response) => {
                var data = response.data;
                if (data.user_id) {
                    Store.commit('setIsLoggedIn', true);
                    Store.commit('setContactId', data.user_id);
                    Store.commit('setCompanyId', data.company_id);
                    //Remove remember_token
                    var query = {};
                    query['remember_token'] = {$exists: true};
                    window.db.spryDB.remove(query, {multi: true});
                    //Save remember_token to DB
                    window.db.spryDB.insert({remember_token: data.remember_token});
                    //Route to home
                    window.f7.views[1].loadPage('/');
                } else {
                    Store.commit('setIsLoggedIn', false);
                    //Clear existing token
                    var query = {};
                    query['remember_token'] = {$exists: true};
                    window.db.spryDB.remove(query, {multi: true});
                }
            });
        }
    },
    mounted() {
        Events.$on('setCountry-ev', function(country_id) {
            this.country_id = country_id;
        }.bind(this));
    },
    components: {
        loginErrors,
        countriesListing
    }
});

//account form
import accountForm from "../vues/account/form.vue";

Vue.component('page-account', {
    template: '#page-account',
    computed: {
        current_latitude() {
            return Store.state.latitude;
        },
        current_longitude() {
            return Store.state.longitude;
        }
    },
    mounted: function() {
        var data = {'latitude': this.current_latitude, 'longitude': this.current_longitude, 'info': 'Current location'};
        Events.$emit('mapInfo-ev', data);
    },
    components: {
        accountForm
    }
});

//register form
import registerForm from "../vues/register/form.vue";

Vue.component('page-register', {
    template: '#page-register',
    components: {
        registerForm
    }
});

//orders
import tableRows from "../vues/orders/rows.vue";
import tablePagination from "../vues/orders/pagination.vue";

Vue.component('page-orders', {
    template: '#page-orders',
    data() {
        return {
            rawData: [],
            sortBy: 'id',
            sort: 'desc',
            draw: 1,
            page: 5,
            total: '',
            filtered: '',
            excludeColumns: ['items', 'showItems'],
            addColumns: ['action']
        }
    },
    computed: {
        tableData() {

            var response = this.rawData;

            response = _.map(response, function(obj, index) {
                obj['lock'] = (index === this.lockIndex) ? this.lockValue : true;
                return obj;
            }.bind(this));

            return response;
        },
        contact_id() {
            return Store.state.contact_id;
        }
    },
    methods: {
        List: function() {
            axios.post('https://sprypizza.com/api/orders/get', {
                contact_id: this.contact_id,
                draw: this.draw,
                page: this.page,
                sortBy: this.sortBy,
                sort: this.sort
            }).then(function(json) {
                var response = json.data.response;
                this.total = response.total;
                this.filtered = response.filtered;
                this.rawData = _.map(response.orders, function(obj, index) {
                    obj['showItems'] = false;
                    return obj;
                });
            }.bind(this));
        },
        StrAdj: function(str) {
            var string = str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            return string.replace('_', ' ');
        }
    },
    mounted: function() {

        this.List();

        Events.$on('showItems-ev', function(idx) {
            this.tableData[idx]['showItems'] = (this.tableData[idx]['showItems'] === true) ? false : true;
        }.bind(this));

        Events.$on('sort-ev', function(idx) {
            this.Sort(idx);
        }.bind(this));

        Events.$on('setPage-ev', function(draw) {
            this.draw = draw;
            this.List();
        }.bind(this));

        Events.$on('tableRefresh-ev', function() {
            this.List();
        }.bind(this));
    },
    components: {
        tablePagination,
        tableRows
    }
});


//rewards
import rewardsRows from "../vues/rewards/datatable/rows.vue";
import rewardsPagination from "../vues/rewards/datatable/pagination.vue";
import rewardsColumns from "../vues/rewards/datatable/columns.vue";
Vue.component('page-rewards', {
    template: '#page-rewards',
    data() {
        return {
            rawData: [],
            settings: [],
            sortBy: 'id',
            sort: 'desc',
            draw: 1,
            page: 10,
            total: '',
            filtered: '',
            excludeColumns: ['id', 'contact_id', 'updated_at'],
            addColumns: ['expiry'],
        }
    },
    computed: {
        tableColumns: function() {
            var response = this.rawData;
            //Table columns
            var returnedKeys = [], idx = 0;
            //data keys
            var keys = _.keys(_.first(response));
            //excluded keys
            var excludeColumns = this.excludeColumns;
            keys.forEach(function(ele) {
                if (excludeColumns.indexOf(ele) < 0) {
                    var key = this.StrAdj(ele);
                    returnedKeys[idx] = {
                        'column': key,
                        'sort': (key !== this.sortBy) ? "none" : this.sort,
                        'sortClass': (key !== this.sortBy) ? "fa-sort" : "fa-sort-" + this.sort
                    };
                    idx++;
                }
            }.bind(this));
            //additional keys
            for (var i = 0; i < this.addColumns.length; i++) {
                returnedKeys[idx] = {
                    'column': this.StrAdj(this.addColumns[i]),
                    'sort': "none",
                    'sortClass': "fa-sort"
                };
                idx++;
            }

            return returnedKeys;
        },
        tableData: function() {
            return this.rawData;
        },
        totalPoints: function() {
            var total = 0;
            this.rawData.forEach(function(obj) {
                total += parseFloat(obj.points);
            });

            return total;
        },
        pointsExpiry: function() {
            return this.settings.expiry;
        },
        contact_id() {
            return Store.state.contact_id;
        },
        company_id() {
            return Store.state.company_id;
        }
    },
    methods: {
        List: function() {
            axios.post('https://sprypizza.com/api/rewards/list', {
                contact_id: this.contact_id,
                draw: this.draw,
                page: this.page,
                sortBy: this.sortBy,
                sort: this.sort
            }).then(function(json) {

                var response = json.data.response;
                this.total = response.total;
                this.filtered = response.filtered;
                this.rawData = response.rewards;
            }.bind(this));
        },
        Settings: function() {
            axios.post('https://sprypizza.com/api/rewards/settings', {
                company_id: this.company_id
            }).then(function(json) {
                this.settings = json.data.response
            }.bind(this));
        },
        Sort: function(idx) {

            var columns = this.tableColumns;
            var sort = columns[idx]['sort'];
            var column = columns[idx]['column'];

            switch (sort) {
                case "none":
                    sort = "asc";
                    break;
                case "asc":
                    sort = "desc";
                    break;
                case "desc":
                    sort = "asc";
                    break;
            }

            //Assign to store
            this.sort = sort;
            this.sortBy = column;
            //Refresh data
            this.List();
        },
        StrAdj: function(str) {
            var string = str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            return string.replace('_', ' ');
        }
    },
    mounted: function() {

        this.List();
        this.Settings();

        Events.$on('sort-ev', function(idx) {
            this.Sort(idx);
        }.bind(this));

        Events.$on('setPage-ev', function(draw) {
            this.draw = draw;
            this.List();
        }.bind(this));
    },
    components: {
        rewardsPagination,
        rewardsRows,
        rewardsColumns
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
        Gmap
    }
});

//Cart icon instance
Vue.component('item-count', {
    template: "#item-count",
    computed: {
        itemcount() {
            return Store.state.itemCount;
        }
    }
});

//track page
import statusBar from "../vues/tracking/status.vue";
// import Gmap from "../vues/generic/map/map.vue";
import driverDetails from "../vues/tracking/driver.vue";

Vue.component('page-track', {
    template: '#page-track',
    data() {
        return {
            order: {
                order_id: '',
                address: '',
            },
            employee: {
                name: '',
                mobile: ''
            },
            branch: {
                name: ''
            }
        }
    },
    methods: {
        Get() {

            window.db.spryDB.find({}, (err, doc) => {
                _.map(doc, (obj, idx) => {
                    if (_.has(obj, 'order_id')) {
                        this.order.order_id = obj.order_id;
                    }
                });
            });

            setTimeout(() => {
                axios.post('https://sprypizza.com/api/orders/track', {
                    order_id: this.order.order_id
                }).then(function(response) {

                    var order = response.data.response.order;
                    var branch = response.data.response.branch;
                    var employee = response.data.response.employee;

                    //Order
                    Events.$emit('status-ev', order.status);
                    this.order.address = order.full_address;
                    this.order.order_id = order.id;
                    //Branch
                    this.branch.name = branch.name;
                    //Init Map
                    var markers = [
                        {
                            lati: order.latitude,
                            longi: order.longitude,
                            icon: "img/pins/map_marker.png",
                            title: 'Delivery Address'
                        },
                        {
                            lati: branch.latitude,
                            longi: branch.longitude,
                            icon: "img/pins/branch_icon.png",
                            title: 'Branch Location'
                        }
                    ];
                    if (employee) {
                        markers.push({
                            lati: employee.latitude_c,
                            longi: employee.longitude_c,
                            icon: "img/pins/driver_marker.png",
                            title: 'Driver Location'
                        });
                    }
                    Events.$emit('mapMarkers-ev', markers);
                    //Employee
                    this.employee.name = employee.title + ' ' + employee.first_name + ' ' + employee.last_name;
                    this.employee.mobile = employee.mobile;
                }.bind(this));
            }, 500);
        }
    },
    components: {
        statusBar,
        Gmap,
        driverDetails
    },
    mounted: function() {
        this.Get();
    }
});


// Init App
new Vue({
    el: '#app',
    // Init Framework7 by passing parameters here
    framework7: {
        root: '#app',
        swipePanel: 'both',
        reveal: true,
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
            },
            {
                path: '/branches/',
                component: 'page-branches'
            },
            {
                path: '/branch/',
                component: 'page-branch'
            },
            {
                path: '/account/',
                component: 'page-account'
            },
            {
                path: '/register/',
                component: 'page-register'
            },
            {
                path: '/login/',
                component: 'page-login'
            },
            {
                path: '/orders/',
                component: 'page-orders'
            },
            {
                path: '/track/',
                component: 'page-track'
            },
            {
                path: '/track-order/',
                component: 'page-track-order'
            },
            {
                path: '/rewards/',
                component: 'page-rewards'
            }
        ],
    },
    methods: {
        Cart() {
            //Verify cart status
            //Read from DB
            window.db.cartDB.find({}, (err, doc) => {
                var len = doc.length;
                Store.commit('setItems', doc);
                Store.commit('setItemCount', len);
            });
        },
        RememberMe() {
            //Verify remember_token
            window.db.spryDB.find({}, (err, doc) => {
                _.map(doc, (obj, idx) => {
                    if (_.has(obj, 'remember_token')) {

                        axios.post('https://sprypizza.com/api/login/remember', {
                            remember_token: obj.remember_token
                        }).then((response) => {

                            var data = response.data.response;

                            if (data.user_id) {
                                Store.commit('setIsLoggedIn', true);
                                Store.commit('setContactId', data.user_id);
                                Store.commit('setCompanyId', data.company_id);

                            } else {
                                Store.commit('setIsLoggedIn', false);
                                Store.commit('setContactId', '');
                                Store.commit('setCompanyId', '');
                                //Clear existing token
                                var query = {};
                                query['remember_token'] = {$exists: true};
                                window.db.spryDB.remove(query, {multi: true});
                            }
                        });
                    }
                });
            });
        }
    },
    mounted() {
        this.RememberMe();
        this.Cart();
    }
});