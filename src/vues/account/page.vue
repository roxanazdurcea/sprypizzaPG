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
                <login-icon></login-icon>
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
    import loginIcon from "../login/pageIcon.vue";
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
            loginIcon
        }
    }
</script>