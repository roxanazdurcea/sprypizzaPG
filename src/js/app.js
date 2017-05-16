// Init F7 Vue Plugin
window.Vue.use(Framework7Vue);

window.myApp = new Framework7();

import loginIcon from "../vues/login/icon.vue";
import pageHome from "../vues/home/page.vue";
import pageTrackOrder from "../vues/tracking/page.vue";
import leftPanel from "../vues/panel/left.vue";
import pageMenu from "../vues/menu/page.vue";
import pageCart from "../vues/cart/page.vue";
import pageBranches from "../vues/branches/page.vue";
import pageBranchClosest from "../vues/branches/pageClosest.vue";
import pageLogin from "../vues/login/page.vue";
import pageAccount from "../vues/account/page.vue";
import pageRegister from "../vues/register/page.vue";
import pageOrders from "../vues/orders/page.vue";
import pageRewards from "../vues/rewards/page.vue";
import pageCheckout from "../vues/checkout/page.vue";
import itemCount from "../vues/cart/item-count.vue";
import pageTrack from "../vues/tracking/page1.vue";

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
                component: pageHome
            },
            {
                path: '/menu/',
                component: pageMenu
            },
            {
                path: '/cart/',
                component: pageCart
            },
            {
                path: '/checkout/',
                component: pageCheckout
            },
            {
                path: '/branches/',
                component: pageBranches
            },
            {
                path: '/branch/',
                component: pageBranchClosest
            },
            {
                path: '/account/',
                component: pageAccount
            },
            {
                path: '/register/',
                component: pageRegister
            },
            {
                path: '/login/',
                component: pageLogin
            },
            {
                path: '/orders/',
                component: pageOrders
            },
            {
                path: '/track/',
                component: pageTrack
            },
            {
                path: '/track-order/',
                component: pageTrackOrder
            },
            {
                path: '/rewards/',
                component: pageRewards
            }
        ],
    },
    methods: {
        Cart() {
            //Verify cart status
            //Read from DB
            window.db.itemsDB.find({}, (err, doc) => {
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
    },
    components: {
        loginIcon,
        leftPanel,
        itemCount
    }
});