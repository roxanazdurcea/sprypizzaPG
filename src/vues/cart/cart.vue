<template>
    <section id="cart" v-bind:class="{'active': cartActive}">

        <div id="screen-cover" v-bind:class="{'active': cartActive}" v-on:click="closeCart()"></div>
        <div class="container-fluid">
            <div class="cart-content">
                <div class="row" style="height: 8%; padding-top: 2%;">
                    <div class="col-xs-10 col-sm-11">
                        <h1 class="no-top-margin product-title"><b>Shopping Cart</b></h1>

                    </div>
                    <div class="col-xs-2 col-sm-1">
                        <div class="cart-close pull-right"><i class="fa fa-close" v-on:click="closeCart()"></i></div>
                    </div>
                </div>
                <hr>


                <form class="coolScroll" style="height: 70%; padding:15px;">
                    <div v-show="items.length === 0">
                        <h1>Your cart is empty!</h1>
                        <p>Hurry up and fill it with goodies!</p>
                    </div>
                    <ul class="product-preview-small itemsWrap" style="padding-left: 0px;">
                        <li style="width:100%;" v-for="(item, idx) in items" v-bind:class="{ borderB : idx < items.length - 1 }">

                            <div class="cart-product-row">
                                <div class="hidden-xs cart-product-image">
                                    <img style="width: 100%;" alt="" class="itemImg" v-bind:src="imageURL+item.image">
                                </div>
                                <div class="cart-product-title">
                                    <h4 class="product-title"><b>{{ item.name }}</b></h4>
                                </div>
                                <div class="cart-product-price"><p style="margin-bottom: 0px;"><b>{{ currency }}{{item.price }}</b></p></div>
                                <div class="cart-icons">
                                    <i title="Add Extras" class="fa fa-plus-circle fa-lg" aria-hidden="true" v-on:click="listModifiers(idx)"></i>
                                    <i title="Remove Item" class="fa fa-times-circle fa-lg" aria-hidden="true" v-on:click="rmItem(idx)"></i>
                                </div>
                            </div>

                            <div class="cart-product-row" v-for="(extra, extras_idx) in item.extras">
                                <div class="hidden-xs cart-product-image"></div>
                                <div class="cart-product-title">
                                    <ul>
                                        <li><p>{{ extra.name }}</p></li>
                                    </ul>
                                </div>
                                <div class="cart-product-price"><b>{{ currency }}{{ extra.price }}</b></p></div>
                                <div class="cart-icons">
                                    <i class="fa fa-times-circle" aria-hidden="true" v-on:click="rmExtra(idx, extras_idx)"></i>
                                </div>
                            </div>

                            <div style="display: table; width: 100%; margin-top:2%;">
                                <div class="hidden-xs space-column"></div>
                                <div style="display: table-cell; vertical-align: middle; width: 100%; padding-bottom:5px;">
                                    <div>
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
                <div style="overflow: hidden;">
                    <div class="row" style="padding-top: 2%;">
                        <div class="col-xs-8 col-sm-6 text-xs-center" style="padding-right:5px;">
                            <div class="btn-group pull-left">
                                <button class="btn btn-danger" v-on:click="clearCart()" style=""><a>Clear cart</a></button>
                                <button class="btn btn-warning"><a href="/checkout" v-on:click="checkout()" style="">Checkout</a></button>
                            </div>
                        </div>
                        <div class="col-xs-4 col-sm-6 text-right" style="padding-left: 0px;">
                            <p class="text-right" style="padding-top: 5px; padding-bottom: 5px;">VAT {{ currency }}{{Math.round(0.20*cartTotal * 100) / 100 }}</p>
                            <h4 class="text-right product-title"><b>TOTAL {{ currency }}{{ cartTotal }}</b></h4>
                        </div>
                    </div>
                </div>
            </div><!-- .cart-content -->
        </div><!-- .container -->
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

    #cart {
        position: fixed;
        right: 0;
        width: 100%;
        top: 10vh;
        height: 80vh;
        visibility: hidden;
        opacity: 0;
        color: #c1c6cd;
        z-index: 1500;
        transition: visibility 0.4s ease-out, opacity 0.4s ease-out, transform 0.4s ease-out;
    }

    #cart.active {
        visibility: visible;
        opacity: 1;
    }

    .coolScroll {
        overflow-y: auto;
    }

    /* Let's get this party started */
    .coolScroll::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    /* Track */
    .coolScroll::-webkit-scrollbar-track {
        background-color: rgb(231, 231, 231);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    /* Handle */
    .coolScroll::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        height: 20px;
        background-color: #777;;
    }

    #screen-cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        visibility: hidden;
        z-index: -1;
        background-color: rgba(255, 255, 255, 0.6);
    }

    #screen-cover.active {
        opacity: 1;
        visibility: visible;
    }

    .cart-content {
        border: 5px #ddd solid;
        background: #FFF;
        color: #303030;

        &:hover {
             opacity: 1;
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

    .dropdown-menu {
        min-width: 100%;
    }

    .cart-close {
        font-size: 2rem;
        line-height: 2.2rem;
        color: grey;
        opacity: 0.7;
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
    }

    .btn{
        border-radius: 0px !important;
    }

    @media (min-width: 1441px) {
            width: 40%;
            float: right;
            h1 {
                font-size: 2.2rem;
                line-height: 2.4rem;
                margin-top: 0px;
            }
            h4 {
                margin-top: 0px;
                font-size: 2rem;
                line-height: 2.2rem;
            }
            p {
                font-size: 1.6rem;
                line-height: 1.8;
                margin-bottom: 5px;
                border-radius: 0px;
            }
            .fa-plus-circle, .fa-times-circle {
                font-size: 1.7rem;
            }
            ul li {
                font-size: 1.5rem;
                font-weight: 400;
                margin: 10px 0 0 0;
            }
        }
        @media only screen and (min-width: 1281px) and (max-width: 1440px) {
            width: 40%;
            float: right;
            h1 {
                font-size: 2.2rem;
                line-height: 2.4rem;
                margin-top: 0px;
            }
            h4 {
                margin-top: 0px;
                font-size: 1.6rem;
                line-height: 2.2rem;
            }
            p {
                font-size: 1.2rem;
                line-height: 1.4rem;
                margin-bottom: 5px;
                border-radius: 0px;
            }
            .fa-plus-circle, .fa-times-circle {
                font-size: 1.7rem;
            }
            ul li {
                font-size: 1.2rem;
                font-weight: 400;
                margin: 10px 0 0 0;
            }
        }
        @media only screen and (min-width: 769px) and (max-width: 1280px) {
            width: 40%;
            float: right;
            h1 {
                font-size: 2rem;
                line-height: 2.2rem;
                margin-top: 0px;
            }
            h4 {
                margin-top: 0px;
                font-size: 1.8rem;
                line-height: 2rem;
            }
            p {
                font-size: 1.4rem;
                line-height: 1.4;
                margin-bottom: 5px;
                border-radius: 0px;
            }
            .fa-plus-circle, .fa-times-circle {
                font-size: 1.7rem;
            }
            ul li {
                font-size: 1.3rem;
                font-weight: 400;
                margin: 10px 0 0 0;
            }
        }
        @media only screen and (min-width: 426px) and (max-width: 768px) {
            width: 100%;
            h1 {
                font-size: 2rem;
                line-height: 2.2rem;
                margin-top: 0px;
            }
            h4 {
                margin-top: 0px;
                font-size: 1.8rem;
                line-height: 2rem;
            }
            p {
                font-size: 1.1rem;
                line-height: 1.4rem;
                margin-bottom: 5px;
                border-radius: 0px;
            }
            .fa-plus-circle, .fa-times-circle {
                font-size: 1.7rem;
            }
            ul li {
                font-size: 1.2rem;
                font-weight: 400;
                margin: 10px 0 0 0;
            }
            ol, ul {
                list-style: none;
            }
        }
        @media only screen and (min-width: 321px) and (max-width: 425px) {
            width: 100%;
            h1 {
                font-size: 1.7rem;
                line-height: 1.9rem;
                margin-top: 0px;
            }
            h4 {
                margin-top: 0px;
                font-size: 1.5rem;
                line-height: 1.7rem;
            }
            p {
                font-size: 0.9rem;
                line-height: 1.1rem;
                margin-bottom: 5px;
                border-radius: 0px;
            }
            .fa-plus-circle, .fa-times-circle {
                font-size: 1.8rem;
            }
            ul li {
                font-size: 0.9rem;
                font-weight: 400;
                margin: 10px 0 0 0;
            }
            ol, ul {
                list-style: none;
            }
        }
        @media (max-width: 320px) {
            width: 100%;
            h1 {
                font-size: 1.6rem;
                line-height: 2rem;
                margin-top: 0px;
            }
            h4 {
                margin-top: 0px;
                font-size: 1.3rem;
                line-height: 1.5rem;
            }
            p {
                font-size: 0.9rem;
                line-height: 1.2;
                margin-bottom: 5px;
                border-radius: 0px;
            }
            .fa-plus-circle, .fa-times-circle {
                font-size: 1.7rem;
            }
            ul li {
                font-size: 1rem;
                font-weight: 400;
                margin: 10px 0 0 0;
            }
            ol, ul {
                list-style: none;
            }
        }
    }

    .no-top-margin {
        margin-top: 0 !important;
    }

    .product-preview-small {
        width: 100%;
        list-style: none;
    }

    .product-preview-small .product-content {
        overflow: hidden;
    }

    .product-preview-small .product-img {
        float: left;
        margin-right: 15px;
    }

    .product-preview-small .product-title {
        font-family: 'Open Sans Condensed', sans-serif;
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

    .cart-product-row {
        display: table;
        width: 100%;
    }

    .cart-product-image {
        display: table-cell;
        width: 20%;
    }

    .cart-product-title {
        padding-left: 2%;
    }

    .cart-product-price {
        display: table-cell;
        width: 10%;
    }

    .cart-icons {
        display: table-cell;
        width: 10%;
        text-align: right;
    }

    .cart-icons .fa-plus-cirle {
        margin-right: 5px;
    }

    .fa-plus-circle {
        color: #F9A153;
    }

    .fa-times-circle {
        color: #D12027;
    }

    .text-xs-center {
        text-align: center;
    }

    .button-yellow {
        display: inline-block;
        padding: 10px 20px;
        text-transform: uppercase;
        border: none;
        outline: none;
        color: #FFF;
        width: 100%;
        background-color: #F9A153;
    }

    .button-yellow:focus,
    .button-yellow:hover,
    .button-yellow a:focus,
    .button-yellow a:hover {
        color: #000;
    }

    .product-title {
        color: #D12027;
    }

    .row {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    @media (max-width: 375px) {
        .cart-icons {
            width: 20%;
        }
    }

    @media only screen and (min-width: 376px) and (max-width: 1249px) {
        .cart-icons {
            width: 15%;
        }
    }

    @media (max-width: 320px) {

        .product-preview-small .product-title {
            margin-left: 5px;
            margin-top: 0px;
            font-size: 1.3rem;
            line-height: 1.5rem;
        }

        .button-yellow  {
            font-size: 0.9rem;
            line-height: 1.2;
            margin-bottom: 5px;
            border-radius: 0px;
        }

        .cart-product-price {
            font-size: 1rem;
            font-weight: 400;
            margin: 10px 0 0 0;
        }
    }

    @media only screen and (min-width: 321px) and (max-width: 425px) {

        .product-preview-small .product-title {
            margin-left: 8px;
            margin-top: 0px;
            font-size: 1.5rem;
            line-height: 1.7rem;
        }

        .button-yellow  {
            font-size: 0.9rem;
            line-height: 1.1rem;
            margin-bottom: 5px;
            border-radius: 0px;
        }

        .cart-product-price {
            font-size: 0.9rem;
            font-weight: 400;
            margin: 10px 0 0 0;
        }
    }

    @media only screen and (min-width: 426px) and (max-width: 768px) {

        .product-preview-small .product-title {
            margin-left: 8px;
            margin-top: 0px;
            font-size: 1.8rem;
            line-height: 2rem;
        }

        .button-yellow  {
            font-size: 1.1rem;
            line-height: 1.4rem;
            margin-bottom: 5px;
            border-radius: 0px;
        }

        .cart-product-price {
            font-size: 1.2rem;
            font-weight: 400;
            margin: 10px 0 0 0;
        }
    }

    @media only screen and (min-width: 769px) and (max-width: 1280px) {

        .product-preview-small .product-title {
            margin-left: 8px;
            margin-top: 0px;
            font-size: 1.6rem;
            line-height: 1.8rem;
        }

        .button-yellow  {
            font-size: 1.4rem;
            line-height: 1.4;
            margin-bottom: 5px;
            border-radius: 0px;
        }

        .cart-product-price {
            font-size: 1.3rem;
            font-weight: 400;
            margin: 10px 0 0 0;
        }
    }

    @media only screen and (min-width: 1281px) and (max-width: 1440px) {

        .product-preview-small .product-title {
            margin-left: 10px;
            margin-top: 0px;
            font-size: 1.7rem;
            line-height: 1.9rem;
        }

        .button-yellow {
            font-size: 1.6rem;
            line-height: 1.8;
            margin-bottom: 5px;
            border-radius: 0px;
        }

        .cart-product-price {
            font-size: 1.3rem;
            font-weight: 400;
            margin: 10px 0 0 0;
        }
    }

    @media (min-width: 1441px) {

        .product-preview-small .product-title {
            margin-left: 10px;
            margin-top: 0px;
            font-size: 1.7rem;
            line-height: 2.2rem;
        }

        .button-yellow  {
            font-size: 1.6rem;
            line-height: 1.8;
            margin-bottom: 5px;
            border-radius: 0px;
        }

        .cart-product-price {
            font-size: 1.5rem;
            font-weight: 400;
            margin: 10px 0 0 0;
        }
    }
</style>