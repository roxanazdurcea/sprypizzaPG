<template>
    <div class="row product-list">
        <div class="col-md-6 product-preview-container" v-for="(item, idx) in items">
            <div class="product-preview-big">
                <img alt="product photo" v-bind:src="imageURL+item.image" class="product-img">
                <div class="product-content">
                    <div class="product-content-inner">
                        <h4 id="product-title">{{ item.name }}</h4>
                        <star-rating :value="item.rating | round" :disabled="disabled"></star-rating>
                        <p id="product-description">{{ item.description }}</p>
                        <div>
                            <div style="float: left;" id="product-price">Price <span>${{ item.price }}</span></div>
                            <div class="cart-plus-qty">
                                <div class="product-pieces">
                                    <div>{{ item.qty }}</div>
                                    <div class="product-pieces-up" v-on:click="Increase(idx)"></div>
                                    <div class="product-pieces-down" v-on:click="Decrease(idx)"></div>
                                </div>
                                <button v-on:click="addToCart(item)"
                                        style="background-color: rgba(255, 255, 255, 0.4); border: 0px;"><p style="margin-top: 5px; margin-bottom: 5px;">add to cart</p>
                                </button>

                            </div>
                        </div>
                    </div>
                </div><!-- .product-content -->
            </div><!-- .product-preview-big -->
        </div><!-- .col-md-6 -->
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import starRating from "../generic/rating/rating.vue";

    export default {
        name: 'itemscontainer',
        data: function() {
            return {
                items: [],
                disabled: "true"
            }
        },
        computed: {
            imageURL: function() {
                return Store.state.imageURL;
            }
        },
        filters: {
            round: function(value) {
                var val = parseFloat(value, 2);
                return val.toFixed(0);
            }
        },
        methods: {
            Read: function() {
                this.$http.post('https://sprypizza.com/api/items', {group_id: Store.state.group_id}).then(function(data) {
                    var itemresponse = _.toArray(data.body.response);
                    itemresponse = _.map(itemresponse, function(item) {
                        item['qty'] = 1;
                        item['extras'] = [];
                        item['modifiers'] = [];
                        item['modifiers']['showFreeModifiers'] = false;
                        item['modifiers']['showAddModifiers'] = false;
                        item['modifiers']['showDeleteModifiers'] = false;
                        return item;
                    });
                    this.items = itemresponse;
                }.bind(this));
            },
            addToCart: function(item) {
                var q = item.qty;
                item['qty'] = 1;

                for (var i = 0; i < q; i++) {
                    Store.commit('addItem', item);
                }
                var items =JSON.stringify(Store.state.items);
                items = JSON.parse(items);
                Store.commit('setItems', items);
                Store.commit('setCartActive', true);
            },
            Increase: function(idx) {
                this.items[idx]['qty']++;
            },
            Decrease: function(idx) {
                this.items[idx]['qty']--;
                if (this.items[idx]['qty'] < 1) this.items[idx]['qty'] = 1;
            }
        },
        mounted: function() {

            this.Read();

            Events.$on('listitemesvent', function(group_id) {
                this.Read();
            }.bind(this));
        },
        components: {
            starRating
        }
    }
</script>

<style>

    #product-description {
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
    }

    .product-preview-container {
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .product-preview-big {
        position: relative;
        border: 1px transparent solid;
    }


    .product-preview-big:hover {
         border-color: #F9A153;
     }

    .product-preview-big img {
        display: block;
        width: 100%;
    }

    .product-preview-big .product-content {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 60%;
        background-color: rgba(0, 0, 0, 0.6);
        color: #FFF;
        font-style: italic;
        font-size: 15px;
    }

    .product-preview-big .product-content-inner {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px 30px;
    }

    .product-preview-big #product-price {
        font-family: 'Open Sans Condensed', sans-serif;
        font-style: normal;
        font-size: 17px;
    }

    .product-preview-big #product-price > span {
        font-size: 20px;
    }

    /*.product-preview-big {*/
        /*margin-bottom: 55px;*/
    /*}*/

    .product-preview-big:after {
         bottom: -58px;
     }

    @media (max-width: 425px) {

        .product-preview-big .product-content-inner{
            padding: 10px 10px;
        }

    }





    @media (max-width: 580px) {
        .product-preview-big .product-content {
            height: 30%;
            position: static;
            width: 100%;
        }
        .product-list .col-md-6{
            padding-right: 0px;
            padding-left: 0px;
        }
    }

    .product-pieces {
        position: relative;
        padding-right: 25px;
        margin-left: 8px;
        margin-right: 8px;
        display: inline-block;
    }
    .product-pieces.product-pieces-readonly .product-pieces-up,
    .product-pieces.product-pieces-readonly .product-pieces-down {
        opacity: 0.5;
        cursor: default;
    }
    .product-pieces.product-pieces-readonly .product-pieces-up:hover,
    .product-pieces.product-pieces-readonly .product-pieces-down:hover {
        border-color: #c1c6cd;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
    .product-pieces input[type=text] {
        width: 35px;
        margin: 0;
        padding: 5px 10px;
    }
    .product-pieces .product-pieces-up,
    .product-pieces .product-pieces-down {
        position: absolute;
        right: 0;
        width: 22px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        color: #FFF;
        border: 1px #c1c6cd solid;
        background-color: transparent;
        cursor: pointer;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        -webkit-transition: all 0.2s ease-out;
        -moz-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
    }
    .product-pieces .product-pieces-up:after,
    .product-pieces .product-pieces-down:after {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        content: '';
        font-family: 'FontAwesome';
    }
    .product-pieces .product-pieces-up:hover,
    .product-pieces .product-pieces-down:hover {
        border-color: #FFF;
        -webkit-box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.4);
        -moz-box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.4);
        box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.4);
    }
    .product-pieces .product-pieces-up {
        top: -7px;
    }
    .product-pieces .product-pieces-up:after {
        content: '\f0d8';
    }
    .product-pieces .product-pieces-down {
        bottom: -7px;
    }
    .product-pieces .product-pieces-down:after {
        content: '\f0d7';
    }


    .cart-plus-qty {
        float: right;
    }
    @media only screen and (min-width: 991px) and (max-width: 1250px) {
        .cart-plus-qty{
            float: left;
        }
    }

</style>