window.myApp = new Framework7({
    pushState: 'true',
    swipePanel: 'left'
});

window.Cookies = {
    Create: function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    Get: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    },
    Erase: function (name) {
        this.Create(name, "", -1);
    }
};

window._ = require('underscore');
window.Vue = require('vue');
import Vuex from 'vuex';
window.Vue.use(Vuex);
import resource from 'vue-resource';
window.Vue.use(resource);

window.Events = new Vue();

import shoppingcart from "../vues/cart/cart.vue";
import itemCount from "../vues/cart/item-count.vue";
import branches from "../vues/branches/branch.vue";
import closestBranch from "../vues/branches/closet-branch.vue";
import accountForm from "../vues/account/form.vue";
import registerForm from "../vues/register/form.vue";

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

//Cart icon instance
new Vue({
    el: "#itemCount",
    methods: {
        openCart: function () {
            Store.commit('toggleCartActive');
        }
    },
    components: {
        itemCount
    }
});

//all branches
new Vue({
    el: "#branches-container",
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    components: {
        branches
    }
});

//closest branche
new Vue({
    el: '#closest-branch',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    components: {
        closestBranch
    }
});

//account form
new Vue({
    el: '#account-container',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    components: {
        accountForm
    }
});

//register form
new Vue({
    el: '#register-container',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    components: {
        registerForm
    }
});

