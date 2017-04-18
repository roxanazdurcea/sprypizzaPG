<template>
    <section id="cart" v-bind:class="{'active': cartActive}">

        <div class="cart-content">
            <form style="padding: 3%;">

                <div v-show="items.length === 0">
                    <br>
                    <h1 style="text-align: center;">Your cart is empty!</h1>
                    <h5 style="text-align: center;">Hurry up and fill it with goodies!</h5>
                </div>

                <ul class="product-preview-small itemsWrap" style="padding-left: 0px;">
                    <li style="width: 100%;" v-for="(item, idx) in items" v-bind:class="{ borderB : idx < items.length - 1 }">

                        <div class="cart-product-row">
                            <div class="cart-product-title"><h4>{{ item.name }}</h4></div>
                            <div class="cart-product-price"><p style="margin-bottom: 0px;">{{currency}}&nbsp;{{item.price}}</p>
                            </div>
                            <div class="cart-icons">
                                <div class="icon-minus" v-on:click="rmItem(idx)" style="margin-left: 5px;">
                                    <i class="f7-icons size-22">delete_round_fill</i></div>
                                <div class="icon-plus" v-on:click="listModifiers(idx)"><i class="f7-icons size-22">add_round_fill</i>
                                </div>
                            </div>
                        </div>

                        <div class="cart-product-row" v-for="(extra, extras_idx) in item.extras">
                            <div class="cart-product-title">
                                <ul>
                                    <li><p>{{ extra.name }}</p></li>
                                </ul>
                            </div>
                            <div class="cart-product-price">{{currency}}&nbsp;{{extra.price}}</p></div>
                            <div class="cart-icons">
                                <div class="icon-minus" v-on:click="rmExtra(idx, extras_idx)">
                                    <i class="f7-icons size-22">delete_round_fill</i></div>
                            </div>
                        </div>

                        <div style="display: table; width: 100%; margin-top:2%;">
                            <div style="display: table-cell; vertical-align: middle; width: 100%; padding-bottom:5px;">
                                <div class="modifiers buttons-row">

                                    <div class="btn-group" style="width: 33%;" v-show="item.modifiers.showFreeModifiers">
                                        <button style="width: 100%;" type="button" class="button modi-button" v-on:click="openMod">
                                            <i class="f7-icons"></i> Free
                                        </button>
                                        <ul class="dropdown-menu" style="padding: 10px;">
                                            <li style="cursor: pointer" v-for="modifier in item.modifiers.modifiers_free" v-on:click="addModifier(modifier, idx)">
                                                <span>{{ modifier.name }}</span><span style="float:right;">{{ currency }}{{ modifier.price }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="btn-group" style="width: 33%;" v-show="item.modifiers.showAddModifiers">
                                        <button style="width: 100%;" type="button" class="button modi-button" v-on:click="openMod">
                                            <i class="f7-icons"></i> Add
                                        </button>
                                        <ul class="dropdown-menu" style="padding: 10px;">
                                            <li style="cursor: pointer" v-for="modifier in item.modifiers.modifiers_add" v-on:click="addModifier(modifier, idx)">
                                                <span>{{ modifier.name }}</span><span style="float:right;">{{ currency }}{{ modifier.price }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="btn-group" style="width: 33%;" v-show="item.modifiers.showDeleteModifiers">
                                        <button style="width: 100%;" type="button" class="button modi-button" v-on:click="openMod">
                                            <i class="f7-icons"></i> Substract
                                        </button>
                                        <ul class="dropdown-menu" style="padding: 10px;">
                                            <li style="cursor: pointer" v-for="modifier in item.modifiers.modifiers_delete" v-on:click="addModifier(modifier, idx)">
                                                <span>{{ modifier.name }}</span><span style="float:right;">{{ currency }}{{ modifier.price }}</span>
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
                    <h4 class="text-center product-title"><b>TOTAL {{ currency }}&nbsp;{{ cartTotal }}</b></h4>
                    <p class="text-center" style="padding-top: 5px; padding-bottom: 5px;">VAT&nbsp;{{currency}}&nbsp;{{Math.round(0.20*cartTotal
                        * 100) / 100 }}</p>
                </div>
                <br>
                <div class="row">
                    <p class="col-50" v-on:click="clearCart()">
                        <a href="#" class="button button-big color-red">Clear cart</a>
                    </p>
                    <p class="col-50" v-on:click="checkout()">
                        <a href="#view-4" class="tab-link button button-big color-orange">Checkout</a>
                    </p>
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
            cartTotal() {
                var total = 0;
                this.items.forEach((item) => {
                    total += parseFloat(item.price);
                    if (_.has(item, 'extras')) {
                        item.extras.forEach(function (extra) {
                            total += parseFloat(extra.price);
                        });
                    }
                });
                return total;
            },
            cartActive() {
                return Store.state.cartActive;
            },
            items() {
                return Store.state.items;
            },
            imageURL() {
                return Store.state.imageURL;
            },
            currency() {
                return Store.state.currency;
            }
        },
        methods: {
            openMod(event) {
                this.closeMod();
                var ele = event.target;
                ele.closest('div').classList.add("open");
            },
            closeMod() {
                var btngroups = document.getElementsByClassName("btn-group");
                _.each(btngroups, function (ele) {
                    ele.classList.remove("open");
                });
            },
            clearCart() {
                localStorage.clear();
                Store.commit('clearItems');
            },
            closeCart() {
                Store.commit('setCartActive', false);
            },
            rmItem(idx) {
                Store.commit('removeItem', idx);
            },
            rmExtra(idx, extras_idx) {
                Store.commit('removeExtra', idx, extras_idx);
            },
            checkout() {
                var itemsArray = {};
                itemsArray.items = _.clone(this.items);
                itemsArray.total = this.cartTotal;
                localStorage.setItem('cart', JSON.stringify(itemsArray));
            },
            listModifiers(idx) {
                var item_id = this.items[idx]['id'];

                axios.post('https://sprypizza.com/api/modifiers', {
                    item_id: item_id
                }).then((data) => {

                    var response = data.data.response;

                    var items = _.clone(this.items);

                    items[idx]['modifiers']['modifiers_free'] = [];
                    items[idx]['modifiers']['modifiers_add'] = [];
                    items[idx]['modifiers']['modifiers_delete'] = [];

                    response.forEach((obj) => {
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
                    });

                    items[idx]['modifiers']['showFreeModifiers'] = (items[idx]['modifiers']['modifiers_free'].length > 0) ? true : false;
                    items[idx]['modifiers']['showAddModifiers'] = (items[idx]['modifiers']['modifiers_add'].length > 0) ? true : false;
                    items[idx]['modifiers']['showDeleteModifiers'] = (items[idx]['modifiers']['modifiers_delete'].length > 0) ? true : false;

                    Store.commit('setItems', items);
                });
            },
            addModifier(modifier, idx) {
                var items = _.clone(this.items);
                items[idx]['extras'].push(modifier);
                items[idx]['modifiers']['showAddModifiers'] = items[idx]['modifiers']['showFreeModifiers'] = items[idx]['modifiers']['showDeleteModifiers'] = false;

                Store.commit('setItems', items);
                this.closeMod();
            }

        },
        mounted() {
            var items = localStorage.getItem('cart');
            if (items) {
                var items = JSON.parse(items)['items'];
                Store.commit('setItems', items);
            }
        },
        updated() {
            var itemsArray = {};
            itemsArray.items = _.clone(this.items);
            itemsArray.total = this.cartTotal;
            localStorage.setItem('cart', JSON.stringify(itemsArray));
            var count = this.items.length;
            Store.commit('setItemCount', count);
        }
    }

</script>

<style lang="less" scoped>

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

    .modifiers:nth-child(3) .dropdown-menu {
        text-align: right;
    }

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
            font-size: 2rem;
        }

        .cart-content h4, .product-preview-small .product-title {
            margin-top: 0px;
            font-size: 1.2rem;
        }

        .cart-content a, .cart-content p, .button-yellow a {
            font-size: 1rem;
            margin-bottom: 0px;
            margin-top: 0px;
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
        width: 100%;
        height: 40px;
        clear: both;
    }

    .cart-product-title {
        width: 60%;
        float: left;
    }

    .cart-product-price {
        width: 10%;
        display: inline-block;
        text-align: center;
    }

    .cart-icons {
        width: 30%;
        float: right;
    }

    .icon-plus {
        float: right;
    }

    .icon-minus {
        float: right;
        color: #D12027;
    }

</style>