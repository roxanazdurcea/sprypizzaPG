<template>
    <f7-page>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="f7-icons size-22 left-side-icon">left</i>
                        <!-- Back link text rendered only for iOS theme -->
                        <span>Back</span>
                    </a>
                </div>
                <div class="center">Login</div>
                <login-icon></login-icon>
            </div>
        </div>
        <f7-block inner>
            <section style="padding: 10px;">
                <div>
                    <div>
                        <h1>Welcome Back!</h1>
                        <p style="margin: 0px;">Sign In To Your Account to See What’s Cooking.</p>
                    </div>
                    <form id="login_Form" class="list-block" method="post">
                        <ul>
                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title label">Country</div>
                                        <countries-listing :country_id="country_id"></countries-listing>
                                    </div>
                                </div>
                            </li>

                            <li class="item-content">
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input class="form-control" name="mobile_number" placeholder="Mobile Number" v-model="mobile_number" autocomplete="off"/>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <button type="button" name="sendSMS" class="button button-big color-orange" autocomplete="off" @click="Send()" v-bind:disabled="isDisabled" style="width:100%;">
                                                Get pin
                                            </button>
                                            <login-errors :error="error" :pin="pin"></login-errors>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <input class="form-control" name="pin_number" placeholder="PIN" autocomplete="off" v-model="pin_number" />
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <label style="padding-left: 5px;" name="rememberMe">Remember me</label>&nbsp;
                                            <input style="float: left; font-weight: normal;" type="checkbox" name="rememberMe" checked="checked"/>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <button type="button" class="button button-big color-orange" style="width: 100%;" v-on:click="Login">
                                                Login
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <button type="button" class="button button-big color-blue" style="width: 100%;">
                                                Facebook Login
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </form>
                    <hr>

                    <a href="/register/" class="item-link" style="color: #6e6e6e; margin-bottom:3%;">
                        <p style="text-align: center;">New here? Register an account</p></a>
                </div>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import loginErrors from "./errors.vue";
    import countriesListing from "./countries.vue";
    import loginIcon from "../login/pageIcon.vue";
    export default {
        name: 'pageLogin',
        data() {
            return {
                mobile_number: '',
                pin_number: '',
                country_id: '40',
                isDisabled: false,
                pin: '',
                error: ''
            }
        },
        methods: {
            Send() {
                axios.post('https://sprypizza.com/api/sms/send', {
                    mobile: this.mobile_number,
                    country_id: this.country_id
                }).then(function(data) {

                    this.error = this.pin = '';

                    if (data.data.error) {
                        this.error = data.data.error;
                    }
                    else if (data.data.pin) {
                        this.isDisabled = true;
                        this.pin = data.data.pin;
                    }
                }.bind(this));
            },
            Login() {

                axios.post("https://sprypizza.com/api/login", {
                    mobile_number: this.mobile_number,
                    country_id: this.country_id,
                    pin_number: this.pin_number,
                    rememberMe: true,
                }).then((response) => {
                    var data = response.data;
                    if (data.user_id) {
                        Store.commit('setIsLoggedIn', true);
                        Store.commit('setContactId', data.user_id);
                        Store.commit('setCompanyId', data.company_id);
                        //Remove remember_token
                        var query = {};
                        query['remember_token'] = {$exists: true};
                        window.db.spryDB.remove(query, {multi: true});
                        //Save remember_token to DB
                        window.db.spryDB.insert({remember_token: data.remember_token});
                        //Route to home
                        window.f7.views[1].loadPage('/');
                    } else {
                        Store.commit('setIsLoggedIn', false);
                        //Clear existing token
                        var query = {};
                        query['remember_token'] = {$exists: true};
                        window.db.spryDB.remove(query, {multi: true});
                    }
                });
            }
        },
        mounted() {
            Events.$on('setCountry-ev', function(country_id) {
                this.country_id = country_id;
            }.bind(this));
        },
        components: {
            loginErrors,
            countriesListing,
            loginIcon
        }
    }
</script>