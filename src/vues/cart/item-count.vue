<template>
    <span>{{ itemcount }}</span>
</template>

<script>

    import {mapState} from 'vuex';

    export default {
        name: 'itemCount',
        computed: {
            itemcount: function () {
                return Store.state.itemCount;
            }
        },
    }
</script>