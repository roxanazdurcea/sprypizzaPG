<template>
    <f7-list>
        <f7-list-item link="/branches/" title="Our Branches" link-view="#main-view" link-close-panel></f7-list-item>
        <f7-list-item link="/branch/" title="Closest Branch" link-view="#main-view" link-close-panel></f7-list-item>
        <f7-list-item link="/account/" title="My Account" link-view="#main-view" link-close-panel v-show="isLoggedIn"></f7-list-item>
        <f7-list-item link="/orders/" title="My Orders" link-view="#main-view" link-close-panel v-show="isLoggedIn"></f7-list-item>
        <f7-list-item link="/rewards/" title="My Rewards" link-view="#main-view" link-close-panel v-show="isLoggedIn"></f7-list-item>
        <f7-list-item link="/register/" title="Register" link-view="#main-view" link-close-panel v-show="!isLoggedIn"></f7-list-item>
    </f7-list>
</template>

<script>
    export default {
        name: 'leftPanel',
        computed: {
            isLoggedIn() {
                return Store.state.isLoggedIn;
            }
        }
    }
</script>