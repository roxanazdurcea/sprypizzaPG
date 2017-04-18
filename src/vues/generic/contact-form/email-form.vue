<template>
    <form class="form-horizontal">
        <div class="form-group" v-bind:class="{'has-error' : nameError}">
            <div class="col-xs-12">
                <input class="form-control input-lg" type="text" style="width: 100%;" placeholder="Name" v-model="name" v-on:keyup="ValidateName()">
                <span class="help-block" v-if="nameError">The name should be a minimum of 5 characters.</span>
            </div>
        </div>
        <div class="form-group" v-bind:class="{'has-error': emailError}">
            <div class="col-xs-12">
                <input class="form-control input-lg" type="email" placeholder="Email Address" style="width: 100%;" v-model="email" v-on:keyup="ValidateEmail()">
                <span class="help-block" v-if="emailError">The email is invalid.</span>
            </div>
        </div>
        <div class="form-group" v-bind:class="{'has-error': subjectError}">
            <div class="col-xs-12">
                <input class="form-control input-lg" type="text" placeholder="Subject" style="width: 100%;" v-model="subject" v-on:keyup="ValidateSubject()">
                <span class="help-block" v-if="subjectError">The subject should be a minimum of 5 characters.</span>
            </div>
        </div>
        <div class="form-group" v-bind:class="{'has-error': messageError}">
            <div class="col-xs-12">
                <textarea class="form-control input-lg" cols="30" rows="10" style="width: 100%;" placeholder="Message" v-model="message" v-on:keyup="ValidateMessage()"></textarea>
                <span class="help-block" v-if="messageError">The message should be a minimum of 15 characters.</span>
            </div>
        </div>
        <div class="form-group">
            <div class="col-md-9 col-sm-offset-3">
                <button class="btn btn-success btn-lg pull-right" type="button" v-bind:disabled="isDisabled" v-on:click="SendEmail()">Send</button>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'emailForm',
        data() {
            return {
                name: '',
                email: '',
                subject: '',
                message: '',
                nameError: null,
                emailError: null,
                subjectError: null,
                messageError: null,
            }
        },
        computed: {
            isDisabled() {
                if (this.nameError || this.emailError || this.subjectError || this.messageError || !this.name || !this.email || !this.subject || !this.message) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        methods: {
            ValidateName() {
                this.nameError = (this.name.length < 5) ? true : false;
            },
            ValidateEmail() {
                var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
                this.emailError = (pattern.test(this.email)) ? false : true;
            },
            ValidateSubject() {
                this.subjectError = (this.subject.length < 5) ? true : false;
            },
            ValidateMessage() {
                this.messageError = (this.message.length < 15) ? true : false;
            },
            SendEmail() {
                var data = {
                    name: this.name,
                    email: this.email,
                    subject: this.subject,
                    message: this.message
                };
                axios.post('/contact/email', data).then(function(response) {
                    var response = response.data.response;
                    window.myApp.alert(response.message, response.title);
                    this.name = this.message = this.email = this.subject = "";
                }.bind(this));
            }
        }
    }
</script>

<style>
    label {
        text-align: left !important;
        font-size: 12px;
    }
</style>