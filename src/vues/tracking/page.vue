<template>
    <f7-page>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="f7-icons size-22 left-side-icon">left</i>
                        <!-- Back link text rendered only for iOS theme -->
                        <span>Back</span>
                    </a>
                </div>
                <div class="center">Track Order</div>
                <div class="right">
                    <a href="#" class="open-panel" data-panel="left"><i class="f7-icons size-22">info</i></a>
                    <a href="/login/"><i class="f7-icons size-22">person</i></a>
                </div>
            </div>
        </div>
        <f7-block inner>
            <section style="padding: 10px;">
                <h1 class="text-center">Order Tracking</h1>
                <hr style="margin-top: 10px; margin-bottom: 10px;">
                <p class="text-center">Get your order status</p>
                <br>
                <order-tracking></order-tracking>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import orderTracking from "./footer.vue";
    export default {
        name: 'pageTrackOrder',
        components: {
            orderTracking
        }
    }
</script>