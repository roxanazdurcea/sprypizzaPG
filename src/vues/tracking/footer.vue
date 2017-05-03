<template>
    <form id="tracking_Form">
        <input autocomplete="off" class="form-control" type="text" name="order_id" placeholder="Enter your order number" v-model="order_id" v-on:keyup="ValidateOrder()">
        <p style="font-size: 11px; text-align: left;" v-if="orderError">
            <i class="fa fa-exclamation-circle" style="color: red;"></i>
            <span style="color: darkred; margin-left: 10px;">{{ errorMsg }}</span>
        </p>
        <p style="font-size: 11px; text-align: left;" v-if="status">
            <i class="fa fa-check" style="color: green;"></i>
            <span style="color: darkred; margin-left: 10px;">Order {{ order_id }} status is {{ status }}.</span>
        </p>
        <div style="margin-top: 2%;">
            <button class="button-yellow button-heavy" type="button" v-on:click="Track()" :disabled="isDisabled" style="width: 100%; background-color: #D12027;">Track</button>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'orderTracking',
        data: function() {
            return {
                order_id: '',
                orderError: false,
                errorMsg: '',
                status: ''
            }
        },
        computed: {
            isDisabled: function() {
                if(this.orderError || this.order_id === '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        methods: {
            ValidateOrder: function() {
                this.$http.post('https://sprypizza.com/api/orders/validate', {
                    order_id: this.order_id,
//                    contact_id: Session.UID
                    contact_id: Store.state.contact_id
                }).then(function(data) {
                    var response = data.body.response;
                    var keys = _.keys(response)[0];

                    switch(keys) {
                        case "error":
                            this.orderError = true;
                            this.errorMsg = response.error;
                            this.status = '';
                            break;
                        case "success":
                            this.orderError = false;
                            this.status = response.success;
                            break;
                    }
                });
            },
            Track: function() {
                if (!this.orderError) {
                    window.location.replace('https://sprypizza.com/api/orders/track/'+this.order_id);
                }
            }
        }
    }
</script>