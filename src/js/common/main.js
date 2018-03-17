
import './../../css/iconfont.css'
// import Vue from 'vue/dist/vue.js'
// import {cube} from './math.js'
import jquery from 'jquery'
window.jQuery = jquery;
import './../../css/common.css'
import './../../css/reset.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrapvalidator/dist/css/bootstrapValidator.min.css'
const bootstrapvalidator = require('bootstrapvalidator/dist/js/bootstrapValidator.js');

import 'bootstrap-select/dist/js/bootstrap-select.min.js'
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
// 日历插件
import '../../../static/plugins/bootstrap-datetimepicker.min.css'
import '../../../static/plugins/bootstrap-datetimepicker.min.js'
import '../../../static/plugins/locales/bootstrap-datetimepicker.zh-CN.js'
import ajax from "./ajax.js"

// import 'layui-src/dist/css/layui.css'
// import '../../../static/plugins/laydate/theme/default/laydate.css'
// const laydate = require('../../../static/plugins/laydate/laydate.js')
// window.laydate = laydate;
window.ajax = ajax.ajax;
window.Api = ajax.api;