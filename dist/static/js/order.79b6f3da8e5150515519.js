webpackJsonp([3],{2:function(t,e,n){"use strict";(function(t){n(5);var e=n(1),a=function(t){return t&&t.__esModule?t:{default:t}}(e);n(3),ajax("checksession","https://nx.smsc.net.cn/wxopen/app/shop/checksession.php/").then(function(t){console.log("登录成功状态！")}),t(document).ready(function(){function e(){console.log("退出");var t=function(){ajax("loginout","https://nx.smsc.net.cn/wxopen/app/shop/logout.php/").then(function(t){console.log("退出登录成功！",t)})};return a.default.myLayerTips("是否退出？",t,"取消","确定")}t("#loginout").on("click",e)})}).call(e,n(0))},24:function(t,e,n){"use strict";(function(t){function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}();n(2);var r=n(1),i=function(t){return t&&t.__esModule?t:{default:t}}(r);n(4),t(document).ready(function(){var n=function(){function t(n,a){e(this,t),this.tableList=n,this.tableWeek=a}return a(t,[{key:"getOrder",value:function(){this.showOrder()}},{key:"showOrder",value:function(){this.cancel()}}]),t}();n.prototype.getDoctorList=function(){var e=this,n=(layer.load(2),this);ajax(Api("getEmpList")).then(function(a){var r="",o=a.data,s=o.length;if(e.doctorList=o,s>0){r+="<thead><tr> <th>序号</th><th>员工姓名</th><th>角色</th><th>排班</th> </tr > </thead><tbody>";for(var c=0;c<s;c++){var l=o[c];r+="\n                        <tr>\n                            <td>"+(c+1)+"</td>\n                            <td>"+l.name+"</td>\n                            <td>"+l.usertype+'</td>\n                            <td> \n                                <input type="hidden" value="'+l.id+'">\n                                <button class="btn btn-warning" id="order-week-btn">按周</button>\n                                <button class="btn btn-danger" id="order-month-btn">按天</button>\n                            </td>\n                        </tr>\n                        '}r+="</tbody>"}else r="<p>暂无数据！</p>";i.default.addHtml(e.tableList,r);var d=function(){n.currentId=t(this).parent().children("input").val(),n.selectList("week")},h=function(){n.currentId=t(this).parent().children("input").val(),n.selectList("month")};e.tableList.unbind("click"),e.tableList.on("click","#order-week-btn",d),e.tableList.on("click","#order-month-btn",h)}).then(function(){setTimeout(function(){layer.close(layer.index)},0)})},n.prototype.getStoreList=function(){var e=this;return new Promise(function(n,a){ajax(Api("getStoreList")).then(function(a){var r='\n                    <label class="checkbox-inline">\n                        <input name="checkStore" type="radio" value="-1">不出诊\n                    </label>\n                ',i=a.data,o=i.length;if(e.storeList=i,o>0)for(var s=0;s<o;s++){var c=i[s];r+='\n                        <label class="checkbox-inline">\n                                <input name="checkStore" type="radio" value="'+c.id+'">'+c.name+"\n                            </label>\n                            "}else r="<p>暂无数据！</p>";var l=t(".order-week-inner-form");l.empty(),l.append(r),n(i)})})},n.prototype.cancel=function(){this.tableList.show(),this.tableWeek.hide(),t(".save-order-time").unbind("click"),t(".cancel-order-time").unbind("click"),t(".order-week-modal-on").unbind("click"),t("#order-week").unbind("click")},n.prototype.selectList=function(e){function n(){o.cancel()}function a(){for(var n=t(".order-week-table td"),a=[],r=0;r<n.length;r++){var i=n[r],s=t(i).children(".day"),c=t(i).children(".am").children(".content").attr("id"),l=t(i).children(".pm").children(".content").attr("id");if(c||l){var d={am:c||"",pm:l||""};d[s.attr("name")]=s.text(),a.push(d)}}o.toSaveOrder(a,e)}function r(t){l=t.target,o.showModal(t)}var i=this,o=this;this.tableList.hide(),this.tableWeek.show();for(var s=0;s<this.doctorList.length;s++){var c=this.doctorList[s];if(c.id===this.currentId){this.name=c.name;break}}this.tableWeek.children("p").html("<p>当前医生："+this.name+"</p>"),"week"===e?this.creatWeek():this.creatMonth(),t(".cancel-order-time").on("click",n),t(".save-order-time").on("click",a);var l="";this.getStoreList().then(function(t){i.tableWeek.on("click",".order-week-table td .content",r)}),t(".order-week-modal-on").on("click",function(){for(var e="",n=t(".order-week-inner-form").serializeArray()[0].value,a=0;a<o.storeList.length;a++){var r=o.storeList[a];if(n==r.id){e=r.name;break}}t(l).empty(),t(l).attr("id",""),t(l).attr("id",n),"-1"==n?(t(l).parent().addClass("not"),t(l).text("不出诊")):(t(l).parent().addClass("out"),t(l).text(e))})},n.prototype.toSaveOrder=function(t,e){var n=this;if(0===t.length)return i.default.myLayer("请选择内容",2),!1;var a={empid:this.currentId},r="";"week"===e?(a.weektime=t,r="saveWeekTime"):(a.date=t,r="saveDayTime"),ajax(Api(r,a)).then(function(t){t.data&&(i.default.myLayer("保存成功！",1),n.cancel())})},n.prototype.showModal=function(e){var n=e.target;if(t(n).parent().removeClass("out not"),t(n).html())return t(n).empty(),t(n).attr("id",""),!1;t("#myModal-order").modal("show")},n.prototype.creatWeek=function(){t(".order-week-table").empty(),ajax(Api("getWeekTime",{empid:this.currentId})).then(function(t){return Promise.resolve(t)}).then(function(t){for(var e="\n            <tr>\n                <th>周一</th>\n                <th>周二</th>\n                <th>周三</th>\n                <th>周四</th>\n                <th>周五</th>\n                <th>周六</th>\n                <th>周日</th>\n            </tr>\n            <tr>",n=[1,2,3,4,5,6,0],a=t.data,r=0;r<n.length;r++){var i="",o="",s="",c="",l="",d="";if(Array.isArray(a))for(var h=0;h<a.length;h++){var u=a[h];if(u.week==n[r]){u.am.id&&(c=u.am.id,"-1"==u.am.id?(i="不出诊",s="not"):(i=u.am.name,s="out")),u.pm.id&&(l=u.pm.id,"-1"==u.pm.id?(o="不出诊",d="not"):(d="out",o=u.pm.name));break}}e+='\n                <td>\n                    <em style="display:none;" name="week" class="day">'+n[r]+'</em>\n                    <span class="am '+s+'">\n                        <span class="time">上午</span>\n                        <p class="content" id="'+c+'">'+i+'</p>\n                    </span>\n                    <span class="pm '+d+'">\n                        <span class="time">下午</span>\n                        <p class="content" id="'+l+'">'+o+"</p>\n                    </span>\n                </td>\n                "}e+="\n                </tr>\n                ",document.getElementsByClassName("order-week-table")[0].innerHTML=e})},n.prototype.creatMonth=function(){var e=" ",n=new Date,a=new Date(n.getTime()).getDay(),r=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],i=[],o=[];r.forEach(function(t,e){e>=a?i.push(t):o.push(t)}),e+="<tr>";for(var s=0;s<i.length;s++)e+="<th>"+i[s]+"</th>";for(var c=0;c<o.length;c++)e+="<th>"+o[c]+"</th>";e+="</tr>",ajax(Api("getDayTime",{empid:this.currentId})).then(function(t){return Promise.resolve(t)}).then(function(t){});for(var l=0;l<30;l++){var d=new Date(n.getTime()+864e5*l).toLocaleDateString();l%7==0&&(e+="</tr><tr>"),e+='\n                <td>\n                    <em name="day" class="day">'+d+'</em>\n                    <span class="am">\n                        <span class="time">上午</span>\n                        <p class="content"></p>\n                    </span>\n                    <span class="pm">\n                        <span class="time">下午</span>\n                        <p class="content"></p>\n                    </span>\n                </td>\n            ',29===l&&(e+="</tr>")}t(".order-week-table").empty(),document.getElementsByClassName("order-week-table")[0].innerHTML=e};var r="";i.default.checkType(r,"Object")||(r=new n(t("#order-table"),t("#order-week"))),r.getOrder(),r.getDoctorList()})}).call(e,n(0))},3:function(t,e,n){"use strict";(function(t){ajax(Api("getCompanyInfo")).then(function(e){t("#header-info img").attr("src",e.data.headimg),t("#header-info .suerName").text(e.data.nickname)})}).call(e,n(0))},4:function(t,e){}},[24]);