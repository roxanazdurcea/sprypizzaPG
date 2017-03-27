import groupscontainer from "../vues/menu/groups.vue";
import itemscontainer from "../vues/menu/items.vue";

//Main instance menu
new Vue({
    el: "#menu-container",
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
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