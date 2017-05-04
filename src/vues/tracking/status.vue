<template>
    <div class="status-container">
        <div v-for="(status, idx) in statuses" v-bind:style="{ top: idx*44+'px' }">
            <span v-if="status.display"><i class="f7-icons size-28">check_round_fill</i></span>
            <span class="status-text">{{ status.value | capitalize }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'statusBar',
        data: function() {
            return {
                statuses: [
                    {value:'pending', display: false},
                    {value:'processing', display: false},
                    {value:'out for delivery', display: false},
                    {value:'delivered', display: false}
                    ],
                statusArray: ['pending','processing','out for delivery','delivered']
            }
        },
        filters: {
            capitalize: function(value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        mounted: function() {
            Events.$on('status-ev', function(status){
                var idx = this.statusArray.indexOf(status);
                this.statuses[idx].display = true;
            }.bind(this));
        }
    }
</script>

<style scoped>
    .status-container {
        width: 250px;
        height: 132px;
        border-left: 4px solid #cccccc;
        position: relative;
    }

    .status-text {
        position: absolute;
        top: 4px;
        left: 40px;
        width: 200px;
        font-weight: 600;
    }

    .status-icon {
        font-size: 40px;
        position: absolute;
        top: -3px;
        left: -3px;
        display: block;
        color: green;
    }

    .status-container div {
        width: 28px;
        height: 28px;
        position: absolute;
        border-radius: 50%;
        background-color: #cccccc;
        left: -16px
    }
</style>