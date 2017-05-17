<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>Track Order</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
        <f7-block inner>
            <section style="padding: 10px;">
                <h1 class="text-center">Order Tracking</h1>
                <hr style="margin-top: 10px; margin-bottom: 10px;">
                <p class="text-center">Get your order status</p>
                <br>
                <order-tracking></order-tracking>
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
    import orderTracking from "./footer.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
    export default {
        name: 'pageTrackOrder',
        components: {
            orderTracking,
            loginIcon,
            itemCount
        }
    }
</script>