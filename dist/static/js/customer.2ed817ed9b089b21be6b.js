webpackJsonp([5],[,,function(t,e,n){"use strict";(function(t){n(12);var e=n(1),o=function(t){return t&&t.__esModule?t:{default:t}}(e);n(3);n(11),t(document).ready(function(){function e(){console.log("退出");var t=function(){ajax("loginout","https://nx.smsc.net.cn/wxopen/app/shop/logout.php/").then(function(t){console.log("退出登录成功！",t)})};return o.default.myLayerTips("是否退出？",t,"取消","确定")}t("#loginout").on("click",e)})}).call(e,n(0))},function(t,e,n){"use strict";function o(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function r(t,e,n){if(t&&c.isObject(t)&&t instanceof o)return t;var r=new o;return r.parse(t,e,n),r}function s(t){return c.isString(t)&&(t=r(t)),t instanceof o?t.format():o.prototype.format.call(t)}function a(t,e){return r(t,!1,!0).resolve(e)}function i(t,e){return t?r(t,!1,!0).resolveObject(e):e}var h=n(4),c=n(7);e.parse=r,e.resolve=a,e.resolveObject=i,e.format=s,e.Url=o;var u=/^([a-z0-9.+-]+:)/i,l=/:[0-9]*$/,f=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,d=["<",">",'"',"`"," ","\r","\n","\t"],p=["{","}","|","\\","^","`"].concat(d),m=["'"].concat(p),v=["%","/","?",";","#"].concat(m),y=["/","?","#"],b=/^[+a-z0-9A-Z_-]{0,63}$/,g=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,w={javascript:!0,"javascript:":!0},C={javascript:!0,"javascript:":!0},j={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},x=n(8);o.prototype.parse=function(t,e,n){if(!c.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var o=t.indexOf("?"),r=-1!==o&&o<t.indexOf("#")?"?":"#",s=t.split(r),a=/\\/g;s[0]=s[0].replace(a,"/"),t=s.join(r);var i=t;if(i=i.trim(),!n&&1===t.split("#").length){var l=f.exec(i);if(l)return this.path=i,this.href=i,this.pathname=l[1],l[2]?(this.search=l[2],this.query=e?x.parse(this.search.substr(1)):this.search.substr(1)):e&&(this.search="",this.query={}),this}var d=u.exec(i);if(d){d=d[0];var p=d.toLowerCase();this.protocol=p,i=i.substr(d.length)}if(n||d||i.match(/^\/\/[^@\/]+@[^@\/]+/)){var O="//"===i.substr(0,2);!O||d&&C[d]||(i=i.substr(2),this.slashes=!0)}if(!C[d]&&(O||d&&!j[d])){for(var _=-1,L=0;L<y.length;L++){var A=i.indexOf(y[L]);-1!==A&&(-1===_||A<_)&&(_=A)}var k,I;I=-1===_?i.lastIndexOf("@"):i.lastIndexOf("@",_),-1!==I&&(k=i.slice(0,I),i=i.slice(I+1),this.auth=decodeURIComponent(k)),_=-1;for(var L=0;L<v.length;L++){var A=i.indexOf(v[L]);-1!==A&&(-1===_||A<_)&&(_=A)}-1===_&&(_=i.length),this.host=i.slice(0,_),i=i.slice(_),this.parseHost(),this.hostname=this.hostname||"";var q="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!q)for(var E=this.hostname.split(/\./),L=0,N=E.length;L<N;L++){var U=E[L];if(U&&!U.match(b)){for(var S="",R=0,D=U.length;R<D;R++)U.charCodeAt(R)>127?S+="x":S+=U[R];if(!S.match(b)){var P=E.slice(0,L),z=E.slice(L+1),V=U.match(g);V&&(P.push(V[1]),z.unshift(V[2])),z.length&&(i="/"+z.join(".")+i),this.hostname=P.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),q||(this.hostname=h.toASCII(this.hostname));var F=this.port?":"+this.port:"",M=this.hostname||"";this.host=M+F,this.href+=this.host,q&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==i[0]&&(i="/"+i))}if(!w[p])for(var L=0,N=m.length;L<N;L++){var T=m[L];if(-1!==i.indexOf(T)){var $=encodeURIComponent(T);$===T&&($=escape(T)),i=i.split(T).join($)}}var H=i.indexOf("#");-1!==H&&(this.hash=i.substr(H),i=i.slice(0,H));var Z=i.indexOf("?");if(-1!==Z?(this.search=i.substr(Z),this.query=i.substr(Z+1),e&&(this.query=x.parse(this.query)),i=i.slice(0,Z)):e&&(this.search="",this.query={}),i&&(this.pathname=i),j[p]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var F=this.pathname||"",B=this.search||"";this.path=F+B}return this.href=this.format(),this},o.prototype.format=function(){var t=this.auth||"";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@");var e=this.protocol||"",n=this.pathname||"",o=this.hash||"",r=!1,s="";this.host?r=t+this.host:this.hostname&&(r=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(r+=":"+this.port)),this.query&&c.isObject(this.query)&&Object.keys(this.query).length&&(s=x.stringify(this.query));var a=this.search||s&&"?"+s||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||j[e])&&!1!==r?(r="//"+(r||""),n&&"/"!==n.charAt(0)&&(n="/"+n)):r||(r=""),o&&"#"!==o.charAt(0)&&(o="#"+o),a&&"?"!==a.charAt(0)&&(a="?"+a),n=n.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),a=a.replace("#","%23"),e+r+n+a+o},o.prototype.resolve=function(t){return this.resolveObject(r(t,!1,!0)).format()},o.prototype.resolveObject=function(t){if(c.isString(t)){var e=new o;e.parse(t,!1,!0),t=e}for(var n=new o,r=Object.keys(this),s=0;s<r.length;s++){var a=r[s];n[a]=this[a]}if(n.hash=t.hash,""===t.href)return n.href=n.format(),n;if(t.slashes&&!t.protocol){for(var i=Object.keys(t),h=0;h<i.length;h++){var u=i[h];"protocol"!==u&&(n[u]=t[u])}return j[n.protocol]&&n.hostname&&!n.pathname&&(n.path=n.pathname="/"),n.href=n.format(),n}if(t.protocol&&t.protocol!==n.protocol){if(!j[t.protocol]){for(var l=Object.keys(t),f=0;f<l.length;f++){var d=l[f];n[d]=t[d]}return n.href=n.format(),n}if(n.protocol=t.protocol,t.host||C[t.protocol])n.pathname=t.pathname;else{for(var p=(t.pathname||"").split("/");p.length&&!(t.host=p.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==p[0]&&p.unshift(""),p.length<2&&p.unshift(""),n.pathname=p.join("/")}if(n.search=t.search,n.query=t.query,n.host=t.host||"",n.auth=t.auth,n.hostname=t.hostname||t.host,n.port=t.port,n.pathname||n.search){var m=n.pathname||"",v=n.search||"";n.path=m+v}return n.slashes=n.slashes||t.slashes,n.href=n.format(),n}var y=n.pathname&&"/"===n.pathname.charAt(0),b=t.host||t.pathname&&"/"===t.pathname.charAt(0),g=b||y||n.host&&t.pathname,w=g,x=n.pathname&&n.pathname.split("/")||[],p=t.pathname&&t.pathname.split("/")||[],O=n.protocol&&!j[n.protocol];if(O&&(n.hostname="",n.port=null,n.host&&(""===x[0]?x[0]=n.host:x.unshift(n.host)),n.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===p[0]?p[0]=t.host:p.unshift(t.host)),t.host=null),g=g&&(""===p[0]||""===x[0])),b)n.host=t.host||""===t.host?t.host:n.host,n.hostname=t.hostname||""===t.hostname?t.hostname:n.hostname,n.search=t.search,n.query=t.query,x=p;else if(p.length)x||(x=[]),x.pop(),x=x.concat(p),n.search=t.search,n.query=t.query;else if(!c.isNullOrUndefined(t.search)){if(O){n.hostname=n.host=x.shift();var _=!!(n.host&&n.host.indexOf("@")>0)&&n.host.split("@");_&&(n.auth=_.shift(),n.host=n.hostname=_.shift())}return n.search=t.search,n.query=t.query,c.isNull(n.pathname)&&c.isNull(n.search)||(n.path=(n.pathname?n.pathname:"")+(n.search?n.search:"")),n.href=n.format(),n}if(!x.length)return n.pathname=null,n.search?n.path="/"+n.search:n.path=null,n.href=n.format(),n;for(var L=x.slice(-1)[0],A=(n.host||t.host||x.length>1)&&("."===L||".."===L)||""===L,k=0,I=x.length;I>=0;I--)L=x[I],"."===L?x.splice(I,1):".."===L?(x.splice(I,1),k++):k&&(x.splice(I,1),k--);if(!g&&!w)for(;k--;k)x.unshift("..");!g||""===x[0]||x[0]&&"/"===x[0].charAt(0)||x.unshift(""),A&&"/"!==x.join("/").substr(-1)&&x.push("");var q=""===x[0]||x[0]&&"/"===x[0].charAt(0);if(O){n.hostname=n.host=q?"":x.length?x.shift():"";var _=!!(n.host&&n.host.indexOf("@")>0)&&n.host.split("@");_&&(n.auth=_.shift(),n.host=n.hostname=_.shift())}return g=g||n.host&&x.length,g&&!q&&x.unshift(""),x.length?n.pathname=x.join("/"):(n.pathname=null,n.path=null),c.isNull(n.pathname)&&c.isNull(n.search)||(n.path=(n.pathname?n.pathname:"")+(n.search?n.search:"")),n.auth=t.auth||n.auth,n.slashes=n.slashes||t.slashes,n.href=n.format(),n},o.prototype.parseHost=function(){var t=this.host,e=l.exec(t);e&&(e=e[0],":"!==e&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},function(t,e,n){(function(t,o){var r;!function(s){function a(t){throw new RangeError(N[t])}function i(t,e){for(var n=t.length,o=[];n--;)o[n]=e(t[n]);return o}function h(t,e){var n=t.split("@"),o="";return n.length>1&&(o=n[0]+"@",t=n[1]),t=t.replace(E,"."),o+i(t.split("."),e).join(".")}function c(t){for(var e,n,o=[],r=0,s=t.length;r<s;)e=t.charCodeAt(r++),e>=55296&&e<=56319&&r<s?(n=t.charCodeAt(r++),56320==(64512&n)?o.push(((1023&e)<<10)+(1023&n)+65536):(o.push(e),r--)):o.push(e);return o}function u(t){return i(t,function(t){var e="";return t>65535&&(t-=65536,e+=R(t>>>10&1023|55296),t=56320|1023&t),e+=R(t)}).join("")}function l(t){return t-48<10?t-22:t-65<26?t-65:t-97<26?t-97:C}function f(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function d(t,e,n){var o=0;for(t=n?S(t/_):t>>1,t+=S(t/e);t>U*x>>1;o+=C)t=S(t/U);return S(o+(U+1)*t/(t+O))}function p(t){var e,n,o,r,s,i,h,c,f,p,m=[],v=t.length,y=0,b=A,g=L;for(n=t.lastIndexOf(k),n<0&&(n=0),o=0;o<n;++o)t.charCodeAt(o)>=128&&a("not-basic"),m.push(t.charCodeAt(o));for(r=n>0?n+1:0;r<v;){for(s=y,i=1,h=C;r>=v&&a("invalid-input"),c=l(t.charCodeAt(r++)),(c>=C||c>S((w-y)/i))&&a("overflow"),y+=c*i,f=h<=g?j:h>=g+x?x:h-g,!(c<f);h+=C)p=C-f,i>S(w/p)&&a("overflow"),i*=p;e=m.length+1,g=d(y-s,e,0==s),S(y/e)>w-b&&a("overflow"),b+=S(y/e),y%=e,m.splice(y++,0,b)}return u(m)}function m(t){var e,n,o,r,s,i,h,u,l,p,m,v,y,b,g,O=[];for(t=c(t),v=t.length,e=A,n=0,s=L,i=0;i<v;++i)(m=t[i])<128&&O.push(R(m));for(o=r=O.length,r&&O.push(k);o<v;){for(h=w,i=0;i<v;++i)(m=t[i])>=e&&m<h&&(h=m);for(y=o+1,h-e>S((w-n)/y)&&a("overflow"),n+=(h-e)*y,e=h,i=0;i<v;++i)if(m=t[i],m<e&&++n>w&&a("overflow"),m==e){for(u=n,l=C;p=l<=s?j:l>=s+x?x:l-s,!(u<p);l+=C)g=u-p,b=C-p,O.push(R(f(p+g%b,0))),u=S(g/b);O.push(R(f(u,0))),s=d(n,y,o==r),n=0,++o}++n,++e}return O.join("")}function v(t){return h(t,function(t){return I.test(t)?p(t.slice(4).toLowerCase()):t})}function y(t){return h(t,function(t){return q.test(t)?"xn--"+m(t):t})}var b=("object"==typeof e&&e&&e.nodeType,"object"==typeof t&&t&&t.nodeType,"object"==typeof o&&o);var g,w=2147483647,C=36,j=1,x=26,O=38,_=700,L=72,A=128,k="-",I=/^xn--/,q=/[^\x20-\x7E]/,E=/[\x2E\u3002\uFF0E\uFF61]/g,N={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},U=C-j,S=Math.floor,R=String.fromCharCode;g={version:"1.4.1",ucs2:{decode:c,encode:u},decode:p,encode:m,toASCII:y,toUnicode:v},void 0!==(r=function(){return g}.call(e,n,e,t))&&(t.exports=r)}()}).call(e,n(5)(t),n(6))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";t.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},function(t,e,n){"use strict";e.decode=e.parse=n(9),e.encode=e.stringify=n(10)},function(t,e,n){"use strict";function o(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,n,s){e=e||"&",n=n||"=";var a={};if("string"!=typeof t||0===t.length)return a;var i=/\+/g;t=t.split(e);var h=1e3;s&&"number"==typeof s.maxKeys&&(h=s.maxKeys);var c=t.length;h>0&&c>h&&(c=h);for(var u=0;u<c;++u){var l,f,d,p,m=t[u].replace(i,"%20"),v=m.indexOf(n);v>=0?(l=m.substr(0,v),f=m.substr(v+1)):(l=m,f=""),d=decodeURIComponent(l),p=decodeURIComponent(f),o(a,d)?r(a[d])?a[d].push(p):a[d]=[a[d],p]:a[d]=p}return a};var r=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},function(t,e,n){"use strict";function o(t,e){if(t.map)return t.map(e);for(var n=[],o=0;o<t.length;o++)n.push(e(t[o],o));return n}var r=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,n,i){return e=e||"&",n=n||"=",null===t&&(t=void 0),"object"==typeof t?o(a(t),function(a){var i=encodeURIComponent(r(a))+n;return s(t[a])?o(t[a],function(t){return i+encodeURIComponent(r(t))}).join(e):i+encodeURIComponent(r(t[a]))}).join(e):i?encodeURIComponent(r(i))+n+encodeURIComponent(r(t)):""};var s=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},a=Object.keys||function(t){var e=[];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.push(n);return e}},function(t,e){},,function(t,e,n){"use strict";(function(t){function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}();n(2);var r=n(1),s=function(t){return t&&t.__esModule?t:{default:t}}(r);t(document).ready(function(){var n=t(".customer"),r=function(){function n(t,o,r,s){e(this,n),this.form=t,this.table=o,this.off=r,this.add=s,this.customerIsEdit=!1,this.store_bind_id="",this.storeListsData=[],this.currentEditData={}}return o(n,[{key:"showOrder",value:function(){t(".off-customer").trigger("click"),this.getStoreLists()}}]),n}();r.prototype.getStoreLists=function(){var t=this;ajax(Api("getStoreList")).then(function(e){e?t.storeListsData=e.data:utli.myLayer("获取门店列表失败！",2)})},r.prototype.getCustomerList_fn=function(){var t=this,e=(layer.load(2),this);console.time(),ajax(Api("getCustomerList")).then(function(o){if(console.timeEnd(),o.data){var r=o.data,a=r.length;t.customerList=r;var i="";if(a>0){i+="<thead>< tr > <th>客户姓名</th><th>微信昵称</th> <th>微信电话</th><th>联系方式</th><th>绑定电话</th><th>创建方式</th><th>绑定操作</th>  <th>操作</th> </tr > </thead ><tbody>";for(var h=0;h<a;h++){var c=r[h];i+="\n                        <tr>\n                            <td>"+c.name+"</td>\n                            <td>"+c.nickname+"</td>\n                            <td>"+c.c_phone+"</td>\n                            <td>"+c.contact+"</td>\n                            <td>"+c.bind_phone+"</td>\n                            <td>"+c.create_by_type+"</td>\n                        ",c.openid?i+='\n                                <td> \n                                    <button data-id="'+c.id+'" data-qrcode="'+c.qrcode+'" class="btn btn-primary" id="customer-show-code-btn">二维码</button>\n                                    <button data-id="'+c.id+'" class="btn btn-danger" id="customer-show-clear-btn">解绑</button>\n                                </td>\n                            ':i+='\n                                <td> \n                                    <button data-id="'+c.id+'" data-qrcode="'+c.qrcode+'" class="btn btn-primary" id="customer-show-code-btn">二维码</button>\n                                </td>\n                            ',i+='\n                            <td> \n                                <input type="hidden" value="'+c.id+'">\n                                <button class="btn btn-warning" id="customer-edit-btn">编辑</button>\n                            </td>\n                        </tr>\n                        '}i+="</tbody>"}else i="<p>暂无数据！</p>";s.default.addHtml(t.table,i),n.on("click","#customer-delet-btn",function(){deletList("deletStore",e.getCustomerList_fn)}),n.on("click","#customer-edit-btn",function(){e.editCustomer(this),e.validator(!0)}),n.on("click","#customer-show-code-btn",function(){e.showCode(this)}),n.on("click","#customer-show-clear-btn",function(){e.clearCode(this)})}}).then(function(){setTimeout(function(){layer.close(layer.index)},200)}),this.add.on("click",function(){e.addNewCustomer(),e.validator()}),this.off.on("click",function(){e.offNewCustomer(),e.clearValidator(),e.store_bind_id=""})},r.prototype.clearCode=function(e){var n=this;ajax(Api("clearCode",{customerid:t(e).attr("data-id")})).then(function(t){t?(s.default.myLayer("客户解绑成功！",1),n.getCustomerList_fn()):s.default.myLayer("客户解绑失败！",2)})},r.prototype.showCode=function(e){ajax(Api("getCustomerQrcode",{customerid:t(e).attr("data-id")})).then(function(e){if(e){var n=e.data;t("#myModal-company").modal("show");var o='\n                        <div class="modal-body">\n                            <div style="width:450px; height:450px;margin:0 auto;">\n                                <iframe id="wxcode" src="'+n+'" frameborder="0" scrolling="no"  width="100%" height="100%;"></iframe>\n                            </div>\n                            \n                        </div>\n                    ';t("#myModal-company-inner").empty(),t("#myModal-company-inner").append(o)}else s.default.myLayer("获取二维码失败！",2)})},r.prototype.addNewCustomer=function(){var e=this;this.add.hide(),this.off.show(),this.table.hide(),this.form.show();var n="";if(this.storeListsData.length>0)for(var o=0;o<this.storeListsData.length;o++){var r=this.storeListsData[o];n+='<li class="fl store-item" data-id="'+r.id+'"><i class="iconfont icon-weixuanze"></i> <span>'+r.name+"</span></li>"}else n="暂无门店列表！您无法添加客户！";s.default.addHtml(t(".store-list-customer"),n),t(".customer-btn-add").on("click",function(){e.addNewCustomerBtn()}),t(".store-list-customer").on("click","li",function(){if(e.customerIsEdit&&"0"!==e.currentEditData.storeid)s.default.myLayer("已绑定门店不可修改！",4);else{var n=t(this);e.store_bind_id=n.attr("data-id"),s.default.addClass(n),n.siblings().removeClass("checked"),n.siblings().children("i").removeClass("icon-yixuanze"),n.siblings().children("i").addClass("icon-weixuanze")}})},r.prototype.editCustomer=function(e){this.customerIsEdit=!0,this.addNewCustomer();for(var n=t(e).parent().children("input").val(),o={},r=0;r<this.customerList.length;r++){var a=this.customerList[r];if(n==a.id){o=Object.assign({},a);break}}this.currentEditData=o;var i=this.form;i.find('input[name="id"]').val(n),i.find('input[name="name"]').val(o.name),i.find('input[name="contact"]').val(o.contact),i.find('input[name="bind_phone"]').val(o.bind_phone),this.store_bind_id=o.storeid;try{var h=t(".store-list-customer li");s.default.restClassName(h,o.storeid)}catch(t){console.log("没有门店列表！")}},r.prototype.validator=function(t){var e=s.default.validatorPass();t&&(e={validators:{stringLength:{min:6,max:30,message:"密码长度不能小于6位或超过30位"},regexp:{regexp:/^[a-zA-Z0-9_\.]+$/,message:"密码只能由字母、数字和下划线。"}}});var n=Object.assign(Object.assign({},s.default.validatorOptions),{fields:{name:s.default.validatorName("客户"),pass:e,contact:s.default.validatorContact(),bind_phone:{validators:{notEmpty:{message:"手机号不能为空！"},regexp:{regexp:/^1[3|5|6|7|8|9]\d{9}$/,message:"手机号格式不正确！"}}}}});this.form.bootstrapValidator(n)},r.prototype.clearValidator=function(){try{this.form.data("bootstrapValidator").destroy(),this.form.data("bootstrapValidator",null)}catch(t){}},r.prototype.addNewCustomerBtn=function(){var t=this;if(this.form.bootstrapValidator("validate"),this.form.data("bootstrapValidator").isValid()){var e=this.form.serializeArray(),n={},o="addCustomer",r="添加成功！";if(this.customerIsEdit&&(o="updateCustomer",r="更新成功！",n.customerid=e[1].value),!this.store_bind_id||"0"===this.store_bind_id)return s.default.myLayer("请选择绑定的门店",2),!1;for(var a=0;a<e.length;a++){var i=e[a];n[i.name]=i.value}n.storeid=this.store_bind_id,ajax(Api(o,n)).then(function(e){e?(s.default.myLayer(r,1),t.off.trigger("click"),t.getCustomerList_fn()):s.default.myLayer("操作失败！",5)})}},r.prototype.offNewCustomer=function(){this.customerIsEdit=!1,this.currentEditData={},this.off.hide(),this.add.show(),this.table.show(),this.form.hide(),t(":input",this.form).val(""),t(".store-list-customer").unbind("click"),t(".customer-btn-add").unbind("click")},s.default.checkLogin().then(function(){s.default.getUserInfo();var e=new r(t(".customer-form"),t(".customer-table"),t(".off-customer"),t(".add-customer"));e.showOrder(),e.getCustomerList_fn()})})}).call(e,n(0))}],[13]);