webpackJsonp([2],{7:function(n,t,a){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}a(8),a(1),a(9);var e=a(0);o(e);a(2),a(3),a(4),a(5);var c=a(6),i=o(c);window.ajax=i.default.ajax},8:function(n,t){},9:function(n,t,a){"use strict";(function(n){n(document).ready(function(){var t="edit";n("#edit").on("click",function(){if("cancal"===t)return n("#edit").text("编辑"),t="edit",ajax("url",{}).then(function(n){return console.log(n),n}),n(".list-company").removeClass("on"),n(".form-company").addClass("on"),!1;n("#edit").text("取消"),t="cancal",n(".list-company").addClass("on"),n(".form-company").removeClass("on")})})}).call(t,a(0))}},[7]);