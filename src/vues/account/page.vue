<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>My Account</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
        <f7-block inner>
            <section style="padding: 10px;">
                <account-form></account-form>
            </section>
        </f7-block>


        <!-- Bottom Tabbar-->
        <div class="toolbar tabbar tabbar-labels toolbar-bottom">
            <div class="toolbar-inner bottom-padding">
                <a href="/" class="item-link"><i class="f7-icons">home</i><span class="tabbar-label">Home</span></a>
                <a href="/menu/" class="item-link"><i class="f7-icons">favorites</i><span class="tabbar-label">Menu</span></a>
                <a href="/cart/" class="item-link"><i class="f7-icons">bag</i><span class="tabbar-label">Cart</span><item-count></item-count></a>
                <a href="/track-order/" class="item-link"><i class="f7-icons">navigation_fill</i><span class="tabbar-label">Track</span></a>
            </div>
        </div>


    </f7-page>
</template>

<script>
    import accountForm from "./form.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
    export default {
        name: 'pageAccount',
        computed: {
            current_latitude() {
                return Store.state.latitude;
            },
            current_longitude() {
                return Store.state.longitude;
            }
        },
        mounted: function() {
            var data = {'latitude': this.current_latitude, 'longitude': this.current_longitude, 'info': 'Current location'};
            Events.$emit('mapInfo-ev', data);
        },
        components: {
            accountForm,
            loginIcon,
            itemCount
        }
    }
</script>