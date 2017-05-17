<template>
    <span class="badge color-red">{{ itemcount }}</span>
</template>

<script>
    export default {
        name: 'itemCount',
        computed: {
            itemcount: function () {
                return Store.state.itemCount;
            }
        }
    }
</script>