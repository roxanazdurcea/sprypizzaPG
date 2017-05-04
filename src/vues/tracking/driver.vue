<template>
    <form>
        <div class="form-group">
            <div class="back-head"><p>Serving Branch</p></div>
            <div><p>{{ branch }}</p></div>
        </div>
        <div class="form-group">
            <div class="back-head"><p>Delivery Address</p></div>
            <div><p>{{ address }}</p></div>
        </div>
        <div class="form-group">
            <div v-if="name">
                <div class="back-head"><p>Driver Name</p></div>
                <div><p>{{ name }}</p></div>
            </div>
            <div v-if="mobile">
                <div class="back-head"><p>Driver Mobile</p></div>
                <div><p>{{ mobile }}</p></div>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'driverDetails',
        props: ['address', 'name', 'mobile', 'branch']
    }
</script>


<style scoped>
    form {

    }

    .back-head {
        background-color: #e3e3e3;
    }

    .back-head p {
        color: #000;
        font-weight: 500;
    }

    p {
        margin: 0px;
        padding: 2%;
    }
</style>