<template>
    <div id="checkout-cart">
        <div>
            <form>
                <ul class="product-preview-small itemsWrap" style="padding-left: 0px;">
                    <li v-for="(item, idx) in items" style="margin-top:5px;">
                        <div class="cart-product-row">
                            <div class="cart-product-title"><h4>{{ item.name }}</h4></div>
                            <div class="cart-product-price"><p style="margin-bottom: 0px;">{{ currency }}&nbsp;{{
                                item.price }}</p></div>
                        </div>

                        <div class="cart-product-row" v-for="(extra, extras_idx) in item.extras">
                            <div class="cart-product-title">
                                <ul>
                                    <li><p>{{ extra.name }}</p></li>
                                </ul>
                            </div>
                            <div class="cart-product-price">{{ currency }}&nbsp;{{ extra.price }}</div>
                        </div>
                    </li>
                </ul><!-- .product-preview-small -->
                <div v-if="items.length === 0"><h6 style="color: red; text-align: center;">The cart is empty !</h6>
                </div>
            </form>
        </div>


        <hr>
        <div>

            <div class="totals-div">
                <div>
                    <h4 class="text-center product-title"><b>TOTAL {{ currency }}&nbsp;{{ cartTotal }}</b></h4>
                    <p class="text-center" style="padding-top: 5px; padding-bottom: 5px;">VAT&nbsp;{{currency}}&nbsp;{{Math.round(0.20*cartTotal
                        * 100) / 100 }}</p>
                </div>
            </div>
            <br/>
            <div class="note-div">
                <h6 style="color: #f9a153">Special Note</h6>
                <br/>
                <textarea rows="4" style="font-size: 12px; color: #555555; line-height: 14px; width: 100%;" v-model="note"></textarea>
            </div>
            <br/>
            <div class="address-div">
                <h6 style="color: #f9a153">Delivery Address</h6>
                <p style="font-size: 12px; color: #555555; line-height: 14px;" v-if="address">{{ address }}</p>
                <p style="font-size: 12px; color: red; line-height: 14px;" v-if="!address">No delivery address is
                    selected !</p>
            </div>

            <div class="row">
                <p class="col-50">
                    <a href="/menu/" class="item-link button button-big color-orange">Menu</a>
                </p>
                <p class="col-50" v-on:click="confirmOrder()" v-bind:disabled="isDisabled">
                    <a href="#" class="button button-big color-green">Confirm Order</a>
                </p>
            </div>
        </div>
    </div><!-- .cart-content -->
</template>

<script>

    import {mapState} from 'vuex';
    import modalAlert from "../generic/modal/modal.vue";

    export default {
        name: 'checkoutCart',
        props: ['address', 'latitude', 'longitude', 'branch_id'],
        data: function () {
            return {
                note: ''
            }
        },
        computed: {
            cartTotal: function () {
                var total = 0;
                this.items.forEach(function (item) {
                    total += parseFloat(item.price);
                    if (_.has(item, 'extras')) {
                        item.extras.forEach(function (extra) {
                            total += parseFloat(extra.price);
                        });
                    }
                });
                return total;
            },
            items: function () {
                return Store.state.items;
            },
            currency: function () {
                return Store.state.currency;
            },
            isDisabled: function () {
                if (!this.branch_id || this.items.length === 0 || !this.address) {
                    return true;
                } else {
                    return false;
                }
            },
            contact_id() {
                return Store.state.contact_id;
            },
            platform() {
                return Store.state.platform;
            },
            isLoggedIn() {
                return Store.state.isLoggedIn;
            }
        },
        methods: {
            confirmOrder: function () {

                var items = _.clone(this.items);
                var reduced_items = [];

                items.forEach(function (item, index) {
                    var extras = [];
                    item.extras.forEach(function (extra, idx) {
                        extras [idx] = {'item_id': extra.id}
                    });
                    reduced_items[index] = {'item_id': item.id, 'extras': extras};
                });


                var orderData = {
                    platform: this.platform,
                    contact_id: this.contact_id,
                    branch_id: this.branch_id,
                    full_address: this.address,
                    latitude: this.latitude,
                    longitude: this.longitude,
                    items: reduced_items,
                    price: this.cartTotal,
                    note: this.note
                };

                if (this.isLoggedIn) {

                    axios.post('https://sprypizza.com/api/orders/save', orderData).then(function (data) {
                        window.myApp.alert('Your order no.' + data.data.response + ' was successfully submitted', 'Congratulations !');
                        Store.commit('clearItems');
                    });

                } else {
                    window.f7.views[1].loadPage('/login/');
                }
            }
        },
        mounted: function () {
            var items;
            //Read from DB
            window.db.itemsDB.find({}, (err, doc) => {
                items = doc;
            });
            //Update Store
            if (items) {
                Store.commit('setItems', items);
            }
        },
        components: {
            modalAlert
        }
    }

</script>

<style scoped>
    #checkout-cart input {
        z-index: 0;
    }

    #checkout-cart {
        background-color: #FAFAFA;
        border: 5px solid #CCCCCC;
        padding: 10px;
    }

    #checkout-cart .cart-product-row {
        width: 100%;
        clear: both;
    }

    #checkout-cart .cart-product-title {
        width: 80%;
        float: left;
    }

    #checkout-cart .cart-product-price {
        width: 20%;
        display: inline-block;
    }

    #checkout-cart .totals-div {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        background-color: snow;
    }

    #checkout-cart .note-div {
        height: 100px;
    }

    #checkout-cart .address-div {
        height: 75px;
    }

    @media (max-width: 769px) {
        #checkout-cart h1 {
            font-size: 2rem;
        }

        #checkout-cart h4, .product-preview-small .product-title {
            margin-top: 0px;
            font-size: 1.2rem;
        }

        #checkout-cart a, #checkout-cart p, .button-yellow a {
            font-size: 0.9rem;
            margin-bottom: 0px;
            margin-top: 0px;
        }
    }

    /* Track */
    #checkout-cart .panel-body::-webkit-scrollbar-track {

        background-color: rgb(231, 231, 231);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    /* Handle */
    #checkout-cart .panel-body::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        height: 20px;
        background-color: #777;
    }

    @media (max-width: 991px) {
        .cart-content ol, .cart-content ul {
            list-style: none;
        }
    }

    .cart-content .product-preview-small {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .cart-content hr {
        margin-top: 15px;
        margin-bottom: 15px;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .product-preview-small {
        width: 100%;
        list-style: none;
    }

    .product-preview-small .product-title {
        font-family: 'Open Sans Condensed', sans-serif;
        letter-spacing: 1px;
        margin-top: 0;
        font-style: normal;
    }

    @media (max-width: 991px) {
        .product-preview-small li {
            list-style: none;
        }
    }

    .itemsWrap {
        width: 100%;
    }

    .product-title {
        color: #D12027;
    }

</style>