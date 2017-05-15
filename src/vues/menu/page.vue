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
                <div class="center">Menu</div>
                <login-icon></login-icon>
            </div>
        </div>
        <f7-block inner>
            <section style="padding: 10px;">
                <groupscontainer></groupscontainer>
                <itemscontainer></itemscontainer>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import groupscontainer from "./groups.vue";
    import itemscontainer from "./items.vue";
    import loginIcon from "../login/pageIcon.vue";
    export default {
        name: 'pageMenu',
        computed: {
            cartActive: function() {
                return Store.state.cartActive;
            }
        },
        components: {
            groupscontainer,
            itemscontainer,
            loginIcon
        }
    }
</script>