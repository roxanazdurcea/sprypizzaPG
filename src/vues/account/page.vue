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
                <div class="center">My Account</div>
                <div class="right">
                    <a href="#" class="open-panel" data-panel="left"><i class="f7-icons size-22">info</i></a>
                    <a href="/login/"><i class="f7-icons size-22">person</i></a>
                </div>
            </div>
        </div>
        <f7-block inner>
            <section style="padding: 10px;">
                <account-form></account-form>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import accountForm from "./form.vue";
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
            accountForm
        }
    }
</script>