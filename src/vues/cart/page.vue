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
                <div class="center">Cart</div>
                <div class="right">
                    <a href="#" class="open-panel" data-panel="left"><i class="f7-icons size-22">info</i></a>
                    <a href="/login/"><i class="f7-icons size-22">person</i></a>
                </div>
            </div>
        </div>
        <f7-block inner>
            <section style="padding: 10px;">
                <shoppingcart></shoppingcart>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import shoppingcart from "./cart.vue";
    export default {
        name: 'pageCart',
        components: {
            shoppingcart
        }
    }
</script>