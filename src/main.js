
import './css/iconfont.css'
import Vue from 'vue/dist/vue.js'
// import {cube} from './math.js'
import jquery from 'jquery'
window.jQuery = jquery;
import './css/common.css'
import './css/reset.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrapvalidator/dist/css/bootstrapValidator.min.css'
const bootstrapvalidator = require('bootstrapvalidator/dist/js/bootstrapValidator.js');
import ajax from "./js/ajax.js"
window.ajax = ajax.ajax;
window.Api = ajax.api;
window.Vue = Vue;