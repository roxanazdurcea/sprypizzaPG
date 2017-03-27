window._ = require('underscore');
window.Vue = require('vue');
import Vuex from 'vuex';
window.Vue.use(Vuex);
import resource from 'vue-resource';
window.Vue.use(resource);

window.Events = new Vue();

import shoppingcart from "../vues/cart/cart.vue";

window.Store = new Vuex.Store({
    state: {
        cartActive: false,
        itemCount: 0,
        group_id: 71,
        items: [],
        imageURL: "https://sprypizza.com/assets/images/menu/",
        currency: "$"
    },
    mutations: {
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


//Cart instance
new Vue({
    el: "#cart-container",
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    components: {
        shoppingcart
    }
});

