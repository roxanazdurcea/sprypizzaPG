<template>
    <div id="items-rows">

        <div style="padding-top:2%; padding-bottom:2%; border-bottom: 1px dashed #f9a153;" v-for="(row, idx) in rows">
            <div class="tr-order" style="width: 100%;">
                <div style="width: 70%; float: left;" @click="ShowItems(idx)">
                    <div><i class="f7-icons size-15">{{ (row.showItems) ? 'delete_round_fill' : 'add_round_fill' }}</i>
                        Order no.{{ row.id }}
                    </div>
                    <div>{{ row.status | capitalize }}</div>
                    <div>{{ row.created_at }}</div>
                    <div>{{ row.price }} {{ currency }}</div>
                </div>

                <div class="actionDiv" style="width: 30%; float: right;">
                    <button title="ReOrder" class="button button-fill color-orange" v-on:click="ReOrder(idx)" v-bind:disabled=" row.status === 'pending' ">
                        <i class="f7-icons size-15">undo</i>&nbsp;&nbsp;ReOrder
                    </button>
                    <button title="Cancel Order" class="button button-fill color-orange" v-on:click="CancelOrder(idx)" v-bind:disabled=" row.status !== 'pending' ">
                        <i class="f7-icons size-15">close_round_fill</i>&nbsp;&nbsp;Cancel
                    </button>
                    <button title="Track Order" class="button button-fill color-orange" v-on:click="TrackOrder(idx)" v-bind:disabled=" row.status === 'completed' ">
                        <i class="f7-icons size-15">navigation_fill</i>&nbsp;&nbsp;Track
                    </button>
                </div>
                <div style="clear: both;"></div>
            </div>

            <div v-show="row.showItems" style="margin-top: 1%;">
                <div class="tr-items-head">
                    <div>Item</div>
                    <div>Quantity</div>
                    <div>Price</div>
                    <div>Rating</div>
                    <div style="clear: both;"></div>
                </div>
                <div class="tr-items" v-for="item in row.items" style="clear: both;">
                    <div>{{ item.name }}</div>
                    <div>{{ item.qty }}</div>
                    <div>{{ item.price }}</div>
                    <div>
                        <star-rating :value="5" disabled="disabled"></star-rating>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import starRating from "../generic/rating/rating.vue";

    export default {
        name: 'tableRows',
        props: ['rows'],
        filters: {},
        computed: {
            currency() {
                return Store.state.currency;
            }
        },
        methods: {
            ReOrder(idx) {

                var order_id = this.rows[idx].id;

                axios.post('https://sprypizza.com/api/orders/get', {
                    contact_id: Store.state.contact_id,
                    order_id: order_id,
                }).then(response => {

                    var order = response.data.response;
                    var items = order['items'];

                    items.forEach((obj, idx) => {
                        obj.modifiers = [];
                    });

                    //Write to DB
                    window.Cart.Delete();
                    window.Cart.obj = items;
                    window.Cart.Save();
                    //route
                    window.f7.views[1].loadPage('/checkout/');
                });
            },
            CancelOrder(idx) {

                var order_id = this.rows[idx].id;

                axios.post('https://sprypizza.com/api/orders/cancel', {
                    order_id: order_id,
                }).then(function (response) {
                    window.myApp.alert("Your order no. <b>" + order_id + "</b> was cancelled.", "Notice !");
                    Events.$emit('tableRefresh-ev');
                });
            },
            TrackOrder(idx) {

                var order_id = this.rows[idx].id;

                localStorage.setItem('order_id', order_id);

                window.f7.views[1].loadPage('/track/');
            },
            ShowItems(idx) {
                Events.$emit('showItems-ev', idx);
            }
        },
        filters: {
            capitalize(value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        components: {
            starRating
        }
    }
</script>

<style lang="less" scoped>

    #items-rows {
        font-size: 0.8rem;
        padding: 10px;
    }

    #items-rows button {
        height: 20px;
        line-height: 20px;
    }

    .actionDiv {
        display: flex !important;
        flex-direction: column;
        width: 100%;
        justify-content: center;
    }

    .actionDiv button {
        margin: 2px 0 2px 0;
    }

    .tr-items-head {
        padding: 2%;
        color: #f9a153;
        font-size: 0.9rem;
        background-color: #eaeaea;
        height: 20px;
    }

    .tr-items-head div {
        float: left;
    }

    .tr-items-head div:nth-child(1) {
        width: 35%;
        text-align: left;
    }

    .tr-items-head div:nth-child(2) {
        width: 15%;
        text-align: center;
    }

    .tr-items-head div:nth-child(3) {
        width: 20%;
        text-align: center;
    }

    .tr-items-head div:nth-child(4) {
        width: 30%;
        text-align: center;
    }

    .tr-items {
        border-top: 1px dotted #cccccc;
        padding: 2%;
        color: #888888;
        font-size: 0.8rem;
    }

    .tr-items div:nth-child(1) {
        width: 35%;
        text-align: left;
        float: left;
        display: table-cell;
    }

    .tr-items div:nth-child(2) {
        width: 15%;
        text-align: center;
        float: left;
        display: table-cell;
    }

    .tr-items div:nth-child(3) {
        width: 20%;
        text-align: center;
        float: left;
        display: table-cell;
    }

    .tr-items div:nth-child(4) {
        width: 30%;
        text-align: center;
        float: left;
        display: flex;
        align-content: center;
        align-items: center;
    }


</style>