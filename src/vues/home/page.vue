<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>SpryPizza</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>

        <f7-block>
            <div style="position: relative; height: 90vh;">
                <img style="position: absolute; top: 0px; right: 0; height: auto; display: block; max-width: 100%; margin-right: auto; margin-left: auto;" src="img/top-back.png">
                <img style="position: absolute; bottom: 0px; left: 0; height: auto; display: block; max-width: 100%; margin-right: auto; margin-left: auto;" src="img/bottom-back.png">
                <div style="position: absolute; top: 15%; width:50%; margin-left:25%;">
                    <div style="overflow: hidden;">
                        <a href="/menu/" class="item-link"><img style="height: auto; display: block; max-width: 100%; margin-right: auto; margin-left: auto;" src="img/sprypizzaPG-new-order.png"></a>
                        <a href="/track-order/" class="item-link"><img style="height: auto; display: block; max-width: 100%; margin-right: auto; margin-left: auto;" src="img/sprypizzaPG-track-order.png"></a>
                    </div>
                </div>
            </div>
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
    import itemCount from "../cart/item-count.vue";
    import loginIcon from "../login/icon.vue";
    export default {
        name: 'pageHome',
        components: {
            loginIcon,
            itemCount
        }
    }

</script>