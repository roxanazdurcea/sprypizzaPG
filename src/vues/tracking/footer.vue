<template>
    <form id="tracking_Form">
        <input autocomplete="off" class="form-control" type="text" name="order_id" placeholder="Enter your order number" v-model="order_id" v-on:keyup="ValidateOrder()">
        <p style="font-size: 11px; text-align: left;" v-if="orderError">
            <i class="f7-icons size-15" style="color: red;">info_fill</i>
            <span style="color: darkred; margin-left: 10px;">{{ errorMsg }}</span>
        </p>
        <p style="font-size: 11px; text-align: left;" v-if="status">
            <i class="f7-icons size-15" style="color: green;">check_round_fill</i>
            <span style="color: darkred; margin-left: 10px;" v-show="status">Order {{ order_id }} status is {{ status }}.</span>
        </p>
        <div style="margin-top: 2%;">
            <p v-on:click="Track()" :disabled="isDisabled" style="width: 100%; background-color: #D12027;">
                <a href="#" class="item-link button button-big color-orange">Track</a>
            </p>
            <!--<button class="button-yellow button-heavy" type="button" v-on:click="Track()" :disabled="isDisabled" style="width: 100%; background-color: #D12027;">Track</button>-->
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
                if(!this.status || this.order_id === '') {
                    return true;
                } else {
                    return false;
                }
            },
            isLoggedIn() {
                return Store.state.isLoggedIn;
            },
            contact_id() {
                return Store.state.contact_id;
            }
        },
        methods: {
            ValidateOrder: function() {
                this.orderError = false;
                this.errorMsg = '';
                this.status = '';

                axios.post('https://sprypizza.com/api/orders/validate', {
                    order_id: this.order_id,
                    contact_id: this.contact_id
                }).then((response) => {

                    var response = response.data.response;

                    if(!this.isLoggedIn) {
                        this.orderError = true;
                        this.errorMsg = response.error;
                        this.status = '';
                    } else if (response.success) {
                        this.orderError = false;
                        this.status = response.success;
                    }

                });
            },
            Track() {
                if (!this.orderError) {

                    //Delete DB entries with order_id
                    var query = {};
                    query['order_id'] = {$exists: true};
                    window.db.spryDB.remove(query, {multi: true});
                    //Save DB
                    window.db.spryDB.insert({order_id: this.order_id});

                    window.f7.views[1].loadPage('/track/');
                }
            }
        }
    }
</script>

