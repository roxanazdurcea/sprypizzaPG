<template>
    <div>
        <div id="listing">
            <p>Showing {{ 1 + this.page * (this.setPage - 1) }} to {{ (this.setPage * this.page <= this.total) ? this.setPage * this.page : this.total }} of {{ this.total }} entries</p>
        </div>
        <div class="row" style="padding: 5%;">
            <p class="col-50">
                <a href="#" class="button button-big color-orange" v-on:click="Previous" v-bind:disabled=" setPage == 1 ">Previous</a>
            </p>
            <p class="col-50">
                <a href="#" class="tab-link button button-big color-orange" v-on:click="Next" v-bind:disabled=" setPage == pages ">Next</a>
            </p>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'tablePagination',
        props: ['page','total','filtered'],
        data: function () {
            return {
                setPage: 1,
                previousDisabled: false,
                nextDisabled: false
            }
        },
        computed: {
            pages: function() {
                return Math.ceil(this.total/this.page);
            }
        },
        methods: {
            Previous: function() {
                if (this.setPage >= 2) {
                    this.setPage--;
                    Events.$emit('setPage-ev', this.setPage);
                }
            },
            Next: function() {
                if (this.setPage < this.pages) {
                    this.setPage++;
                    Events.$emit('setPage-ev', this.setPage);
                }
            }
        }
    }
</script>

<style lang="less" scoped>

     p{
        margin: 0px;
        font-size: 0.8rem;
        text-align: center;
    }

</style>