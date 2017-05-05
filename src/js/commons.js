window._ = require('underscore');

//Axios Ajax Lib
window.axios = require('axios');

//Vue
window.Vue = require('vue');
window.framework7 = require('framework7');
window.Framework7Vue = require('framework7-vue');

//Store
import Vuex from 'vuex';
window.Vue.use(Vuex);

//Router
import VueRouter from 'vue-router'
window.Vue.use(VueRouter)

//Events
window.Events = new Vue();

//Definition of Databases
var DataStore = require('nedb');
var cartDB = new DataStore({filename: "cart.db"});
var spryDB = new DataStore({filename: "spry.db"});
cartDB.loadDatabase();
spryDB.loadDatabase();

window.Store = new Vuex.Store({
    state: {
        contact_id: "58c8ea591b8e5",
        company_id: "57bf3fb441a58",
        isLoggedIn: false,
        latitude: '44.4267674',
        longitude: '26.1025384',
        cartActive: false,
        itemCount: 0,
        group_id: 71,
        items: [],
        imageURL: "https://sprypizza.com/assets/images/menu/",
        currency: "$",
        platform: "iOS"
    },
    mutations: {
        setLatitude: function (state, latitude) {
            state.latitude = latitude;
        },
        setLongitude: function (state, longitude) {
            state.longitude = longitude;
        },
        setGroupId: function (state, group_id) {
            state.group_id = group_id;
        },
        setItems: function (state, items) {
            state.items = items;
        },
        addItem: function (state, item) {
            var len = state.items.length;
            state.items.splice(len, 0, item);
        },
        setCartActive: function (state, cartActive) {
            state.cartActive = cartActive;
        },
        clearItems: function (state) {
            state.items = [];
        },
        removeItem: function (state, idx) {
            state.items.splice(idx, 1);
        },
        removeExtra: function (state, idx, extras_idx) {
            state.items[idx]['extras'].splice(extras_idx, 1);
        },
        setItemCount: function (state, itemCount) {
            state.itemCount = itemCount;
        },
        toggleCartActive: function (state) {
            state.cartActive = !state.cartActive;
        },
        setIsLoggedIn: function (state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        }
    },
    getters: {}
});


var onSuccess = function (position) {
    Store.commit('setLatitude', position.coords.latitude);
    Store.commit('setLongitude', position.coords.longitude);
};
// onError Callback receives a PositionError object
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
navigator.geolocation.getCurrentPosition(onSuccess, onError);

window.Cart = {
    obj: [],
    Save() {
        cartDB.insert(this.obj);
    },
    Read() {
        cartDB.find({}, (err, doc) => {
            this.obj = doc;
        });
    },
    Delete() {
        cartDB.remove({}, { multi: true });
        this.obj = {};
    }
};

window.Spry = {
    obj: [],
    Save() {
        spryDB.insert(this.obj);
    },
    Read() {
        spryDB.find({}, (err, doc) => {
            this.obj = doc;
        });
    },
    Delete() {
        spryDB.remove({}, { multi: true });
        this.obj = {};
    }
};