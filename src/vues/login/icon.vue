<template>
    <f7-nav-right>
        <a v-bind:href=" isLoggedIn ? '/account/' : '/login/' "><i class="f7-icons size-22">person</i></a>
    </f7-nav-right>
</template>

<script>
    export default {
        name: 'loginIcon',
        computed: {
            isLoggedIn() {
                return Store.state.isLoggedIn;
            }
        }
    }
</script>