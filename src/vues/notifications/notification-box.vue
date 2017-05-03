<template>
    <div class="messageBlock" v-bind:style="{ 'max-height': divHeight + 'px', 'overflow-y': 'auto' }">
        <div class="individualMessage" v-for="(msg, index) in messages" v-bind:class = "{ borderB : index < messages.length - 1 }">
            <img v-bind:src="msg.image" />
            <div style="position: absolute;width: 88%;background: rgba(255, 255, 255, 0.498039); top: 0; left: 0; margin:6%;">
                <div class="bodyMessage">
                    <p style="margin-bottom:3px;"><b>{{ msg.title }}</b></p>
                    <p style="margin-bottom:3px;">{{ msg.message }}</p>
                </div>
                <div class="buttonMessage">
                    <i class="f7-icons size-15" v-on:click="remove(index)">close_round_fill</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'notificationBox',
    data() {
        return {
            messages: []
        }
    },
    computed: {
        divHeight() {
            return window.innerHeight*0.5;
        }
    },
    methods: {
        listAll() {

            axios.post('/messages/read', {
//                user_id: window.Session.UID
                user_id: Store.state.user_id
            }).then(function(data) {
                this.messages = data.data.response;
                if(data.data.response) {
                    Events.$emit('datapass', this.messages.length);
                }
            }.bind(this));
        },
        remove(idx) {

            var id = this.messages[idx]['id'];

            this.messages.splice(idx, 1);

            axios.post('/messages/delete', {
                id: id
            });
        }
    },
    mounted() {
        this.listAll();
        setInterval(this.listAll, 30000);
    }
}
</script>

<style>

    .messageBlock {
        padding: 3%;
        position:relative;
        z-index: 500000;
    }

    .messageBlock > .individualMessage {
        width: 100%;
        position:relative;
        padding: 3%;
    }
    .messageBlock > .individualMessage img {
        position: relative;
        width:100%;
        height: auto;
        top:0;
        left: 0;
    }
    .messageBlock > .individualMessage  .bodyMessage {
        width: 95%;
        float: left;
        color: #000;
    }

    .messageBlock > .individualMessage  .buttonMessage {
        width: 5%;
        float: right;
        color: #000;
    }

    .messageBlock span {
        color: #777;
    }

    /* Let's get this party started */
    .messageBlock::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    /* Track */
    .messageBlock::-webkit-scrollbar-track {

        background-color: rgb(231, 231, 231);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    /* Handle */
    .messageBlock::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        height: 20px;
        background-color: #777;;

    }
</style>