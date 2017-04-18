<template>
    <section style="padding: 10px;">
        <groupscontainer></groupscontainer>
        <itemscontainer></itemscontainer>
    </section>
</template>

<script>
    import groupscontainer from "./groups.vue";
    import itemscontainer from "./items.vue";

    export default {
        name: 'Menu',
        computed: {
            cartActive: function () {
                return Store.state.cartActive;
            }
        },
        components: {
            groupscontainer,
            itemscontainer
        }
    }
</script>