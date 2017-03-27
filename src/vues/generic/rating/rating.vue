<template>
    <span class="star-rating">
        <label
                class="star-rating__star"
                v-for="rating in ratings"
                v-bind:class="{'is-selected': ((value >= rating) && value != null), 'is-disabled': disabled}"
                v-on:mouseover="star_over(rating)"
                v-on:mouseout="star_out"
                v-on:click="set(rating)">
            <input
                    class="star-rating star-rating__checkbox"
                    type="radio"
                    v-bind:value="value"
                    v-bind:disabled="disabled"
                    v-model="value">★
        </label>
    </span>
</template>

<script>
    export default {
        name: "starRating",
        data: function() {
            return {
                temp_value: null,
                ratings: [1, 2, 3, 4, 5]
            };
        },
        props: {
            'value': null,
            'disabled': String
        },
        methods: {
            star_over: function(index) {
                if (this.disabled == "true") {
                    return;
                }
                this.temp_value = this.value;
                this.value = index;
            },
            star_out: function() {
                if (this.disabled == "true") {
                    return;
                }
                this.value = this.temp_value;
            },
            set: function(value) {
                if (this.disabled == "true") {
                    return;
                }
                this.temp_value = value;
                this.value = value;
            }
        }

    }
</script>

<style>
    .star-rating {
        width: 90%;
        margin: 0 auto;
    }
    .star-rating__checkbox {
        position: absolute;
        overflow: hidden;
        clip: rect(0 0 0 0);
        height: 1px;
        width: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
    }

    .star-rating__star {
        display: inline-block;
        padding: 1px;
        vertical-align: middle;
        line-height: 0.9;
        font-size: 1.1em;
        color: #ABABAB;
        -webkit-transition: color;
        transition: color;
    }

    .star-rating__star:hover {
        cursor: pointer;
    }

    .star-rating__star.is-selected {
        color: #F9A153;
    }

    .star-rating__star.is-disabled:hover {
        cursor: default;
    }
</style>