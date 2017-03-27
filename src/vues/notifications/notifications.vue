<template>
    <div class="notificationIcon">
        <div class="noti">
            <span class="badge">{{ messageCount }}</span><i class="fa fa-lg fa-bell-o" v-on:click="setVisible()"></i>
        </div>
        <div>
            <transition name="fade">
                <notificationBox v-show="isVisible"></notificationBox>
            </transition>
        </div>
    </div>
</template>

<script>

    import notificationBox from "./notification-box.vue";

    export default {
        name: 'notifications',
        data: function() {
            return {
                isVisible: false,
                messageCount: 0
            }
        },
        methods: {
            setVisible: function() {
                this.isVisible = (this.messageCount > 0) ? !this.isVisible : this.isVisible;
            }
        },
        mounted: function() {
            Events.$on('datapass', function(messageCount) {
                this.messageCount = messageCount;
            }.bind(this));

            setInterval(function() {
                this.isVisible = (this.isVisible === true) ? false : false;
            }.bind(this), 20000);
        },
        components: {
            notificationBox
        }
    }
</script>

<style>

    .notificationIcon .noti {
        float: right;
        padding: 1%;
    }

    .notificationIcon .noti span {
        margin-right: 7px;
    }

    .notificationIcon > div:nth-child(2) {
        width: 400px;
        z-index:10000;
        background-color: rgb(243, 243, 243);
        position: absolute;
        right: 10px;
        top: 40px;
    }

</style>