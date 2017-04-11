<template>
    <div class="product-list">
        <div class="product-preview-container" v-for="(item, idx) in items" v-bind:class="{ dashedborderB : idx < items.length - 1 }">
            <div class="product-preview-big row">
                <div class="col-33">
                    <img alt="product photo" v-bind:src="imageURL+item.image" class="product-img">
                    <br>
                    <div id="product-price"><p>Price <span>${{ item.price }}</span></p></div>
                </div>
                <div class="col-66">
                    <div class="product-content">
                        <div class="product-content-inner">
                            <h5 id="product-title">{{ item.name }}</h5>
                            <star-rating :value="item.rating | round" :disabled="disabled"></star-rating>
                            <p id="product-description">{{ item.description }}</p>
                            <div>
                                <br>
                                <div class="row">
                                    <div class="col-33">
                                        <p class="product-qty">{{ item.qty }}</p>
                                        <div class="product-pieces">
                                            <i class="f7-icons size-22 product-pieces-up" v-on:click="Increase(idx)">chevron_up</i>
                                            <i class="f7-icons size-22 product-pieces-down" v-on:click="Decrease(idx)">chevron_down</i>
                                        </div>
                                    </div>

                                    <div class="col-66 button modi-button" v-on:click="addToCart(item)"><span>add to cart</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><!-- .product-content -->
                </div>
            </div><!-- .product-preview-big -->
        </div><!-- .col-md-6 -->
    </div>
</template>

<script>

    import {mapState} from 'vuex';
    import starRating from "../generic/rating/rating.vue";

    export default {
        name: 'itemscontainer',
        data: function () {
            return {
                items: [],
                disabled: "true"
            }
        },
        computed: {
            imageURL: function () {
                return Store.state.imageURL;
            }
        },
        filters: {
            round: function (value) {
                var val = parseFloat(value, 2);
                return val.toFixed(0);
            }
        },
        methods: {
            Read: function () {
                this.$http.post('https://sprypizza.com/api/items', {group_id: Store.state.group_id}).then(function (data) {
                    var itemresponse = _.toArray(data.body.response);
                    itemresponse = _.map(itemresponse, function (item) {
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
            addToCart: function (item) {
                var q = item.qty;
                item['qty'] = 1;

                for (var i = 0; i < q; i++) {
                    Store.commit('addItem', item);
                }
                var items = JSON.stringify(Store.state.items);
                items = JSON.parse(items);
                Store.commit('setItems', items);
                Store.commit('setCartActive', true);
            },
            Increase: function (idx) {
                this.items[idx]['qty']++;
            },
            Decrease: function (idx) {
                this.items[idx]['qty']--;
                if (this.items[idx]['qty'] < 1) this.items[idx]['qty'] = 1;
            }
        },
        mounted: function () {

            this.Read();

            Events.$on('listitemesvent', function (group_id) {
                this.Read();
            }.bind(this));
        },
        components: {
            starRating
        }
    }
</script>

<style scoped>

    .dashedborderB {
        border-bottom: 1px dashed #f9a153;
    }

    #product-description {
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.1rem;
    }

    .product-preview-container {
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .product-preview-big {
        position: relative;
        border: 1px transparent solid;
    }

    .product-preview-big img {
        display: block;
        width: 100%;
    }

    .product-preview-big #product-price {
        font-family: 'Open Sans Condensed', sans-serif;
        font-style: normal;
        font-size: 1rem;
    }

    .product-preview-big #product-price > span {
        font-size: 1rem;
    }

    .product-qty {
        margin: 0px;
        font-size: 1rem;
        line-height: 2rem;
    }

    .product-pieces {
        position: relative;
    }

    .product-pieces .product-pieces-up,
    .product-pieces .product-pieces-down {
        position: absolute;
        left: 25px;
        cursor: pointer;
        color: #f9a153;
        font-size: 1.2rem;
    }

    .product-pieces .product-pieces-up {
        top: -30px;
    }

    .product-pieces .product-pieces-down {
        bottom: -3px;
    }

</style>