
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

// import itemCount from "../vues/cart/item-count.vue";
// import branches from "../vues/branches/branch.vue";
// import closestBranch from "../vues/branches/closet-branch.vue";
// import accountForm from "../vues/account/form.vue";
// import registerForm from "../vues/register/form.vue";

window.Store = new Vuex.Store({
    state: {
        contact_id: "58c0312521a1d",
        isLoggedIn: false,
        latitude: '44.4267674',
        longitude: '26.1025384',
        cartActive: false,
        itemCount: 0,
        group_id: 71,
        items: [],
        imageURL: "https://sprypizza.com/assets/images/menu/",
        currency: "$"
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
        }
    },
    getters: {}
});

//
// //Cart icon instance
// new Vue({
//     el: "#itemCount",
//     methods: {
//         openCart: function () {
//             Store.commit('toggleCartActive');
//         }
//     },
//     components: {
//         itemCount
//     }
// });
//
// //all branches
// new Vue({
//     el: "#branches-container",
//     components: {
//         branches
//     }
// });
//
// //closest branch
// new Vue({
//     el: '#closest-branch',
//     components: {
//         closestBranch
//     }
// });
//
// //account form
// new Vue({
//     el: '#account-container',
//     components: {
//         accountForm
//     }
// });
//
// //register form
// new Vue({
//     el: '#register-container',
//     components: {
//         registerForm
//     }
// });

var onSuccess = function(position) {
   Store.commit('setLatitude', position.coords.latitude);
   Store.commit('setLongitude', position.coords.longitude);
};
// onError Callback receives a PositionError object
function onError(error) {
   alert('code: '    + error.code    + '\n' +
           'message: ' + error.message + '\n');
}
navigator.geolocation.getCurrentPosition(onSuccess, onError);

