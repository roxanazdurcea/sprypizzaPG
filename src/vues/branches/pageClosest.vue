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
                <div class="center">Closest Branch</div>
                <div class="right">
                    <a href="#" class="open-panel" data-panel="left"><i class="f7-icons size-22">info</i></a>
                    <a href="/login/"><i class="f7-icons size-22">person</i></a>
                </div>
            </div>
        </div>
        <f7-block inner class="ClosestBranch">
            <section>
                <closest-branch></closest-branch>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import closestBranch from "./closet-branch.vue";
    export default {
        name: 'pageBranchClosest',
        components: {
            closestBranch
        }
    }
</script>