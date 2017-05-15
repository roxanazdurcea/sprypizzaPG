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
                <div class="center">Our Branches</div>
                <login-icon></login-icon>
            </div>
        </div>
        <f7-block inner>
            <section>
                <branches></branches>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import branches from "./branch.vue";
    import loginIcon from "../login/pageIcon.vue";
    export default {
        name: 'pageBranches',
        components: {
            branches,
            loginIcon
        }
    }
</script>