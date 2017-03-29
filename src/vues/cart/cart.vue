<template>
    <section id="cart" v-bind:class="{'active': cartActive}">

        <div class="cart-content">
            <form style="padding: 3%;">

                <div v-show="items.length === 0">
                    <h1>Your cart is empty!</h1>
                    <h5>Hurry up and fill it with goodies!</h5>
                </div>

                <ul class="product-preview-small itemsWrap" style="padding-left: 0px;">
                    <li style="width:100%;" v-for="(item, idx) in items" v-bind:class="{ borderB : idx < items.length - 1 }">

                        <div class="cart-product-row">
                            <div class="cart-product-title">
                                <h4><b>{{ item.name }}</b></h4>
                            </div>
                            <div class="cart-product-price"><p style="margin-bottom: 0px;"><b>{{currency}}{{item.price}}</b></p></div>
                            <div class="cart-icons">
                                <div class="icon-minus" v-on:click="rmItem(idx)" style="margin-left: 5px;">
                                    <i class="f7-icons">delete_round_fill</i></div>
                                <div class="icon-plus" v-on:click="listModifiers(idx)"><i class="f7-icons">add_round_fill</i>
                                </div>
                            </div>
                        </div>

                        <div class="cart-product-row" v-for="(extra, extras_idx) in item.extras">
                            <div class="cart-product-title">
                                <ul>
                                    <li><p>{{ extra.name }}</p></li>
                                </ul>
                            </div>
                            <div class="cart-product-price"><b>{{currency}}{{extra.price}}</b></p></div>
                            <div class="cart-icons">
                                <div class="icon-minus" v-on:click="rmExtra(idx, extras_idx)"><i class="f7-icons">delete_round_fill</i>
                                </div>
                            </div>
                        </div>

                        <div style="display: table; width: 100%; margin-top:2%;">
                            <div style="display: table-cell; vertical-align: middle; width: 100%; padding-bottom:5px;">
                                <div class="modifiers buttons-row">
                                    <div class="btn-group" style="width: 32%;" v-show="item.modifiers.showFreeModifiers">
                                        <button style="width: 100%;" type="button" class="btn btn-default btn-large" v-on:click="openMod">
                                            <i class="fa fa-check-square" aria-hidden="true"></i> Free
                                        </button>
                                        <ul class="dropdown-menu" style="padding: 10px;">
                                            <li style="cursor: pointer" v-for="modifier in item.modifiers.modifiers_free" v-on:click="addModifier(modifier, idx)">
                                                <span>{{ modifier.name }}</span><span style="float:right;">{{ currency }}{{ modifier.price }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="btn-group" style="width: 32%;" v-show="item.modifiers.showAddModifiers">
                                        <button style="width: 100%;" type="button" class="btn btn-default btn-large" v-on:click="openMod">
                                            <i class="fa fa-plus-square" aria-hidden="true"></i> Add
                                        </button>
                                        <ul class="dropdown-menu" style="padding: 10px;">
                                            <li style="cursor: pointer" v-for="modifier in item.modifiers.modifiers_add" v-on:click="addModifier(modifier, idx)">
                                                <span>{{ modifier.name }}</span><span class="pull-right">{{ currency }}{{ modifier.price }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="btn-group" style="width: 32%;" v-show="item.modifiers.showDeleteModifiers">
                                        <button style="width: 100%;" type="button" class="btn btn-default btn-large" v-on:click="openMod">
                                            <i class="fa fa-minus-square" aria-hidden="true"></i> Substract
                                        </button>
                                        <ul class="dropdown-menu" style="padding: 10px;">
                                            <li style="cursor: pointer" v-for="modifier in item.modifiers.modifiers_delete" v-on:click="addModifier(modifier, idx)">
                                                <span>{{ modifier.name }}</span><span class="pull-right">{{ currency }}{{ modifier.price }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </li>
                </ul><!-- .product-preview-small -->
            </form>
            <hr>
            <div style="padding: 5%;">
                <div>
                    <h4 class="text-center product-title"><b>TOTAL {{ currency }}{{ cartTotal }}</b></h4>
                    <p class="text-center" style="padding-top: 5px; padding-bottom: 5px;">VAT
                        {{currency}}{{Math.round(0.20*cartTotal * 100) / 100 }}</p>
                </div>
                <div class="row">
                    <div class="col-50" v-on:click="clearCart()">
                        <a href="#" class="button button-big color-red">Clear cart</a>
                    </div>
                    <div class="col-50" v-on:click="checkout()">
                        <a href="#" class="button button-big color-orange">Checkout</a>
                    </div>
                </div>
            </div>
        </div>
    </section><!-- #cart -->

</template>

<script>

    import {mapState} from 'vuex';

    export default {
        name: 'shoppingcart',
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
            cartActive: function () {
                return Store.state.cartActive;
            },
            items: function () {
                return Store.state.items;
            },
            imageURL: function () {
                return Store.state.imageURL;
            },
            currency: function () {
                return Store.state.currency;
            }
        },
        methods: {
            openMod: function (event) {
                this.closeMod();
                var ele = event.target;
                ele.closest('div').classList.add("open");
            },
            closeMod: function () {
                var btngroups = document.getElementsByClassName("btn-group");
                _.each(btngroups, function (ele) {
                    ele.classList.remove("open");
                });
            },
            clearCart: function () {
                localStorage.clear();
                Store.commit('clearItems');
            },
            closeCart: function () {
                Store.commit('setCartActive', false);
            },
            rmItem: function (idx) {
                Store.commit('removeItem', idx);
            },
            rmExtra: function (idx, extras_idx) {
                Store.commit('removeExtra', idx, extras_idx);
            },
            checkout: function () {
                var itemsArray = {};
                itemsArray.items = _.clone(this.items);
                itemsArray.total = this.cartTotal;
                localStorage.setItem('cart', JSON.stringify(itemsArray));
            },
            listModifiers: function (idx) {
                var item_id = this.items[idx]['id'];

                this.$http.post('https://sprypizza.com/api/modifiers', {
                    item_id: item_id
                }).then(function (data) {

                    var response = data.body.response;

                    var items = _.clone(this.items);

                    items[idx]['modifiers']['modifiers_free'] = [];
                    items[idx]['modifiers']['modifiers_add'] = [];
                    items[idx]['modifiers']['modifiers_delete'] = [];

                    response.forEach(function (obj) {
                        switch (obj.modifier_type) {
                            case "free":
                                items[idx]['modifiers']['modifiers_free'].push(obj);
                                break;
                            case "add":
                                items[idx]['modifiers']['modifiers_add'].push(obj);
                                break;
                            case "delete":
                                items[idx]['modifiers']['modifiers_delete'].push(obj);
                                break;
                        }
                    }.bind(this));

                    items[idx]['modifiers']['showFreeModifiers'] = (items[idx]['modifiers']['modifiers_free'].length > 0) ? true : false;
                    items[idx]['modifiers']['showAddModifiers'] = (items[idx]['modifiers']['modifiers_add'].length > 0) ? true : false;
                    items[idx]['modifiers']['showDeleteModifiers'] = (items[idx]['modifiers']['modifiers_delete'].length > 0) ? true : false;

                    Store.commit('setItems', items);
                });
            },
            addModifier: function (modifier, idx) {
                var items = _.clone(this.items);
                items[idx]['extras'].push(modifier);
                items[idx]['modifiers']['showAddModifiers'] = items[idx]['modifiers']['showFreeModifiers'] = items[idx]['modifiers']['showDeleteModifiers'] = false;

                Store.commit('setItems', items);
                this.closeMod();
            }

        },
        mounted: function () {
            var items = localStorage.getItem('cart');
            if (items) {
                var items = JSON.parse(items)['items'];
                Store.commit('setItems', items);
            }
        },
        updated: function () {
            var itemsArray = {};
            itemsArray.items = _.clone(this.items);
            itemsArray.total = this.cartTotal;
            localStorage.setItem('cart', JSON.stringify(itemsArray));
            var count = this.items.length;
            Store.commit('setItemCount', count);
        }
    }

</script>

<style lang="less">

    .borderB {
        border-bottom: 1px solid #eaeaea;
        margin-bottom: 10px;
        margin-right: 10px;
    }

    .cart-content {
        border: 5px #ddd solid;
        background: #FFF;
        color: #303030;
    }

    .button {
        border: 0px;
    }

    .color-red {
        background-color: #D12027;
        color: #fff;
    }

    .button a:focus, a:hover {
        color: #fff;
        text-decoration: none;
    }

    .color-orange {
        background-color: #F9A153;
        color: #fff;
    }

    p {
        font-family: "Open Sans", sans-serif;
        font-weight: 400;
    }

    h1 {
        font-family: Archer, "Cormorant Garamond", Vollkorn, "Old Standard TT", "Times New Roman", serif;
        margin-bottom: 25px;
        font-weight: normal;
    }

    h4 {
        font-family: "Open Sans", sans-serif;
        font-weight: 400;
        letter-spacing: 0px;
    }
  .modifiers:nth-child(3) .dropdown-menu{
          text-align: right;
    }
    /*.dropdown-menu {*/
        /*min-width: 100%;*/
    /*}*/

    hr {
        margin-top: 15px;
        margin-bottom: 15px;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .product-preview-small {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        list-style: none;
    }

    @media (max-width: 769px) {
        .cart-content h1 {
            font-size: 1.6rem;
            margin-top: 0px;
            margin-bottom: 0px;
        }

        .cart-content h4 {
            vertical-align: middle;
            font-size: 1.8rem;
            margin-top: 0px;
            margin-bottom: 0px;
        }

        .cart-content p {
            font-size: 1.4rem;
            margin-top: 0px;
            margin-bottom: 0px;
        }
    }

    @media (max-width: 991px) {
        .product-preview-small li {
            list-style: none;
        }
    }

    .itemsWrap {
        width: 100%;
    }

    .cart-product-row {
        display: table;
        width: 100%;
    }

    .cart-product-title {
        width: 70%;
        margin: 0;
        vertical-align: middle;
    }

    .cart-product-price {
        display: table-cell;
        width: 10%;
        margin: 0;
        vertical-align: middle;
    }

    .cart-icons {
        display: table-cell;
        width: 20%;
        text-align: right;
    }

    .icon-plus {
        float: right;
    }

    .icon-minus {
        float: right;
        color: #D12027;
    }

</style>