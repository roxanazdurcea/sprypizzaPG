// Init F7 Vue Plugin
window.Vue.use(Framework7Vue)

// Init Page Components
Vue.component('page-about', {
    template: '#page-about'
})
Vue.component('page-form', {
    template: '#page-form'
})

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
            }
        ],
    }
});