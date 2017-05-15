<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <!--<f7-navbar v-if="$theme.material">-->
        <!--<f7-nav-left>-->
        <!--<f7-link icon="icon-bars" open-panel="left"></f7-link>-->
        <!--</f7-nav-left>-->
        <!--<f7-nav-center sliding>SpryPizza</f7-nav-center>-->
        <!--<f7-nav-right>-->
        <!--<f7-link icon="icon-bars" open-panel="right"></f7-link>-->
        <!--</f7-nav-right>-->
        <!--</f7-navbar>-->
        <f7-block>
            <div style="position: relative; height: 85vh;">
                <img style="position: absolute; top: 0px; right: 0; width: 100%;" src="img/top-back.png">
                <img style="position: absolute; bottom: 0px; left: 0; width: 100%;" src="img/bottom-back.png">
                <div style="position: absolute; top: 15%; width:50%; margin-left:25%;">
                    <div style="overflow: hidden;">
                        <a href="/menu/" class="item-link"><img style="width: 100%; height:auto; display: block;" src="img/sprypizzaPG-new-order.png"></a>
                        <a href="/track-order/" class="item-link"><img style="width: 100%; height:auto; display: block;" src="img/sprypizzaPG-track-order.png"></a>
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script>
    export default {
        name: 'pageHome'
    }
</script>