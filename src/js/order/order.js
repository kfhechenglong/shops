"use strict"
import './../common/index-main.js'
import util from './../common/util.js'
import { prototype } from 'events';
// 获取公司信息
$(document).ready(()=>{

    /* 
        排班管理
    */
    class Order {
        constructor (a,b){
            this.tableList = a;
            this.tableWeek = b;
            this.checkObj = {};
            this.canOderId = '';
            this.currentTime = 30;
            this.storeList = [];
            this.isOrderStore = false;
            this.storeLookId = new Set();
            this.empLookId = new Set();
            this.orderAllData = [];
        }
        // 获取列表
        getOrder(){
            this.showOrder()
        }
        showOrder(){
            this.cancel();
        }
        
    }
    // 获取列表
    Order.prototype.getDoctorList = function(){
        const index = layer.load(2);
        const that = this;
        ajax(Api('getEmpList')).then((res) => {
            let html = '';
            const data = res.data,
                length = data.length;
            this.doctorList = data;
            if (length > 0) {
                html += '<thead><tr> <th>序号</th><th>员工姓名</th><th>编辑排班</th> </tr > </thead><tbody>';
                for (let i = 0; i < length; i++) {
                    const tr = data[i];
                    html += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${tr.name}</td>`;
                            // <td><th>预览排班</th>
                            //     <input type="hidden" value="${tr.id}">
                            //     <button class="btn btn-primary" id="look-week-btn">查看排班</button>
                            // </td>
                    html +=`
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="order-week-btn">按周排班</button>
                                <button class="btn btn-danger" id="order-month-btn" style="margin-left:20px;">按天排班</button>
                            </td>
                        </tr>
                        `;
                }
                html += `</tbody>`;
            } else {
                html = `<p>暂无数据！</p>`
            }
            // 添加元素
            util.addHtml(this.tableList, html);
            const _show_week = function () {
                $('.order-week-table').empty();
                that.currentId = $(this).parent().children("input").val();
                that.selectList('week')
            };
            const _show_month = function () {
                $('.order-week-table').empty();
                that.currentId = $(this).parent().children("input").val();
                that.selectList('month')
            };
            this.tableList.unbind("click");
            this.tableList.on('click', '#order-week-btn', _show_week)
            this.tableList.on('click', '#order-month-btn', _show_month)
        }).then(()=>{
            setTimeout(() => {
                layer.close(layer.index)
            }, 100);
        })
    };
    // 点击查看预览排班
    Order.prototype.lookOrder = function(){
        const that = this;
        $('.look-order-back').on('click',function(){
            $('#order-look').hide();
            $('#edit-order-warp').show();
            $(this).hide();
            $('.look-order-class').show();
        })
        $('.look-order-class').on('click',function(){
            console.log('look order');
            $('#order-look').show();
            $('#edit-order-warp').hide();
            $('.look-order-back').show();
            $(this).hide();
            that.isOrderStore = false;
            // 获取门店列表
            if (that.storeList.length == 0){
                ajax(Api('getStoreList')).then((res) => {
                    if(res) {
                        that.storeList = res.data;
                        renderLookHtml()
                    }else{
                        util.myLayer('门店列表数据错误', 2);
                    }
                })
            }else{
                renderLookHtml()
            }
            // 获取排班的60天数据

            ajax(Api('workTime')).then((res) => {
                if(res){
                    that.orderAllData = res.data;
                    $('.edit-people-class').trigger('click');
                }else{
                    util.myLayer('获取排班数据错误',2);
                }
            })
        });
        // setTimeout(() => {
        //     $('.look-order-class').trigger('click');
        // }, 100);
        
        function renderLookHtml(){
            let empHtml = '';
            let storHtml = '';
            for (let i = 0; i < that.doctorList.length; i++) {
                const ele = that.doctorList[i];
                empHtml += `<li class="fl" data-id="${ele.id}"><i class="iconfont icon-weixuanze"></i> <span>${ele.name}</span></li>`;
            }
            for (let i = 0; i < that.storeList.length; i++) {
                const ele = that.storeList[i];
                storHtml += `<li class="fl" data-id="${ele.id}"><i class="iconfont icon-weixuanze"></i> <span>${ele.name}</span></li>`;
            } 
            util.addHtml($('.look-emp-list ul'), empHtml);
            util.addHtml($('.look-store-list ul'), storHtml);
        };
        // 选择员工列表
        $('.look-emp-list ul').on('click','li',function(){
            const target = $(this);
            const id = target.attr('data-id');
            // console.log();
            if(that.isOrderStore){
                util.toggleClassName(target)
                that.empLookId.has(id) ? that.empLookId.delete(id) : that.empLookId.add(id);
                filterDataAndRender();
                return false;
            }
            that.empLookId.clear();
            that.empLookId.add(id);
            that.changeCheckedClass(target);
            filterDataAndRender();
        })
        // 选择门店列表
        $('.look-store-list ul').on('click','li',function(){
            const target = $(this);
            const id = target.attr('data-id');
            if(!that.isOrderStore){
                util.toggleClassName(target);
                that.storeLookId.has(id) ? that.storeLookId.delete(id) : that.storeLookId.add(id);
                filterDataAndRender();
                return false;
            }
            that.storeLookId.clear();
            that.storeLookId.add(id);
            that.changeCheckedClass(target);
            filterDataAndRender();
        });
        // 绑定按店事件
        $('.edit-order-class').on('click',function(){
            that.isOrderStore = true;
            class_name($(this), $('.edit-people-class'),$('.look-store-list li'), $('.look-emp-list li'), that.empLookId,that.storeLookId);
        });
        // 绑定按人事件
        $('.edit-people-class').on('click', function () {
            that.isOrderStore = false;
            // 清空店样式
            class_name($(this), $('.edit-order-class'),$('.look-emp-list li'),$('.look-store-list li'),that.storeLookId,that.empLookId);
        });
        function class_name(target,target_2,lis, store_lis,id_1,id_2){
            target.addClass('btn-primary');
            target_2.removeClass('btn-primary');
            util.toggleClass(lis);
            id_1.clear();
            id_2.clear();
            util.addClass($(lis[0]));
            id_2.add($(lis[0]).attr('data-id'));
            for (let i = 0; i < store_lis.length; i++) {
                const li = $(store_lis[i]);
                util.addClass(li);
                id_1.add(li.attr('data-id'))
            }
            filterDataAndRender();
        };
        // 绑定天数
        $('.look-15-class').on('click',function(){
            that.currentTime = 15;
            $(this).addClass('btn-primary');
            $('.look-30-class').removeClass('btn-primary');
            $('.look-60-class').removeClass('btn-primary');
            filterDataAndRender();
        });
        $('.look-30-class').on('click',function(){
            that.currentTime = 30;
            $(this).addClass('btn-primary');
            $('.look-15-class').removeClass('btn-primary');
            $('.look-60-class').removeClass('btn-primary');
            filterDataAndRender();
        });
        $('.look-60-class').on('click',function(){
            that.currentTime = 60;
            $(this).addClass('btn-primary');
            $('.look-30-class').removeClass('btn-primary');
            $('.look-15-class').removeClass('btn-primary');
            filterDataAndRender();
        });
        // 获取数据
        function filterDataAndRender() {
            if (that.orderAllData.date.length > 0){
                const getRenderData = that.orderAllData.date;//获取排班的数据
                const getRestData = that.orderAllData.rest;//获取休店的设置
                const getcheckEmpId = Array.from(that.empLookId);
                const getcheckStoreId = Array.from(that.storeLookId);
                // 获取按人查询的格式
                const renderHtmlArray = [];
                const allObj = {};
                for (let i = 0; i < getRenderData.length; i++) {
                    const item = getRenderData[i];
                    if (!that.isOrderStore){
                        // 按人查询
                        for (let j = 0; j < getcheckEmpId.length; j++) {
                            const emp_id = getcheckEmpId[j];
                            if (emp_id == item.empid){
                                for (let k = 0; k < getcheckStoreId.length; k++) {
                                    const store_id = getcheckStoreId[k];
                                    if (item.storeid == store_id || item.storeid == '-1'){
                                        if (!allObj[item.date]){
                                            allObj[item.date] = {};
                                        }
                                        allObj[item.date].day = item.date;
                                        if (item.day == '1'){
                                            allObj[item.date].am = {};
                                            allObj[item.date].am.id = item.storeid;
                                            allObj[item.date].am.name = item.storename;
                                            allObj[item.date].am.orderTimes = item.orderTimes;
                                        }
                                        if (item.day == '2'){
                                            allObj[item.date].pm = {};
                                            allObj[item.date].pm.id = item.storeid;
                                            allObj[item.date].pm.name = item.storename;
                                            allObj[item.date].pm.orderTimes = item.orderTimes;
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    } else{
                        for (let k = 0; k < getcheckEmpId.length; k++) {
                            const emp_id = getcheckEmpId[k];
                            if (item.empid == emp_id && getcheckStoreId[0] == item.storeid) {
                                if (!allObj[item.date]) {
                                    allObj[item.date] = {};
                                    allObj[item.date].am = [];
                                    allObj[item.date].pm = [];
                                }
                                allObj[item.date].day = item.date;
                                if (item.day == '1') {
                                    allObj[item.date].am.push({id:item.empid,name:item.empname,orderTimes:item.orderTimes});
                                }
                                if (item.day == '2') {
                                    allObj[item.date].pm.push({ id: item.empid, name: item.empname, orderTimes: item.orderTimes });
                                }
                            }
                        }
                    }
                }
                // console.log(allObj);
                for (const key in allObj) {
                    if (allObj.hasOwnProperty(key)) {
                        const element = allObj[key];
                        // 过滤休店
                        for (let i = 0; i < getRestData.length; i++) {
                            const item = getRestData[i];
                            if (that.isOrderStore) {
                                if (key == item.date && item.storeid == getcheckStoreId[0]){
                                    element.rest = '-2';
                                }
                            } else{
                                if (element.am && key == item.date && item.storeid == element.am.id) {
                                    element.am.id = '-2';
                                }
                                if (element.pm && key == item.date && item.storeid == element.pm.id) {
                                    element.pm.id = '-2';
                                }
                            }
                            
                        }
                        renderHtmlArray.push(element)
                    }
                }
                if (!that.isOrderStore){
                    that.renderMonthHtml(0, that.currentTime, renderHtmlArray,'look-order-table')
                } else{
                    that.renderMonthHtml(0, that.currentTime, renderHtmlArray, 'look-order-table',true)
                }
                
            } else{
                util.myLayer('没有排班数据！',2);
            }
        }
    };
    
    // 点击取消
    Order.prototype.cancel = function (){
        this.tableList.show();
        this.tableWeek.hide();
        this.checkObj = {};
        this.canOderId = '';
        this.currentTime = 30;
        // 显示预览排班
        $('.look-order-class').show();
        // 解绑事件
        $('.save-order-time').unbind("click");
        $('.cancel-order-time').unbind("click");
        $('.order-week-modal-on').unbind("click");
        $('#order-week').unbind("click");
    }
    // 按周按月排班
    Order.prototype.selectList = function (time) {
        this.currentTime = 30;
        $('.look-order-class').hide();
        const that = this;
        // 获取当前的人医生姓名
        for (let i = 0; i < this.doctorList.length; i++) {
            const person = this.doctorList[i];
            if(person.id === this.currentId){
                this.name = person.name;
                break
            }
        }
        const index = layer.load(2);
        ajax(Api('getEmp', { empid: this.currentId })).then((res)=>{
            this.tableList.hide();
            this.tableWeek.show();
            let headerHtml =``;
            const data = res.data.typeRoles,
                    length = data.length;
            if (length > 0){
                headerHtml += `
                    <h3><em style="font-size:18px;">当前员工：</em>${this.name}</em></h3>
                    <div class="clearfix store-list-warp">
                        <h4 class="fl" style="margin:5px;margin-top:16px;">门店列表：</h4>
                        <ul class="clearfix store-lists fl">
                `;
                let firstName = '';
                for (let i = 0; i < data.length; i++) {
                    const ele = data[i].storeId;
                    if( i === 0){
                        if (time !== 'week'){
                            headerHtml += `
                                <li class="fl red"><i class="iconfont icon-weixuanze"></i> <span data-id="-1">不出诊</span></li>
                            `;
                        }
                        headerHtml += `<li class="fl checked"><i class="iconfont icon-yixuanze"></i> <span data-id="${ele.id}">${ele.name}</span></li>`;
                        this.checkObj.id = ele.id;
                        this.checkObj.name = ele.name;
                        firstName = ele.name;
                    }else{
                        headerHtml += `<li class="fl"><i class="iconfont icon-weixuanze"></i> <span data-id="${ele.id}">${ele.name}</span></li>`;
                    }
                }
                headerHtml += `</ul></div>`;
                const time_order = [1,2,3,4,5,6,7,8,9,10];
                headerHtml += `<div class="clearfix order-date-warp">
                <h4 class="fl" style="margin:5px;margin-top:16px;">可预约次数：</h4>
                <ul class="order-date clearfix fl">`;
                for (let i = 0; i < time_order.length; i++) {
                    const time_list = time_order[i];
                    
                    if (time_list == 3){
                        this.canOderId = 3;
                        headerHtml += `<li class="fl checked" data-id='${time_list}'><i class="iconfont icon-yixuanze"> ${time_list}</i></li>`;
                    }else{
                        headerHtml += `<li class="fl" data-id='${time_list}'><i class="iconfont icon-weixuanze"> ${time_list}</i></li>`;
                    }
                }
                headerHtml += `</ul></div>`;
                headerHtml += `
                    <div class="clearfix" style="padding:5px 0;">
                        <ul class="fl legend clearfix">
                            <li class="fl clearfix">
                                <span class="fl">已排班：</span>
                                <em class="checked fl"></em>
                            </li>
                            <li class="fl clearfix">
                                <span class="fl">未排班：</span>
                                <em class="not-checked fl"></em>
                            </li>`;
                if (time === 'week'){
                    headerHtml += `
                        </ul>
                        <button style="padding:12px; font-size:16px;" class="btn btn-primary fr" id="check-all-week-btn">全选${firstName}</button>
                    </div>`;
                }else{
                    headerHtml += `
                            <li class="fl clearfix">
                                <span class="fl">不出诊：</span>
                                <em class="not-out fl"></em>
                            </li>
                        </ul>
                        <button style="padding:12px; font-size:16px;" class="btn fr" id="check-date-60">60天</button>
                        <button style="padding:12px; font-size:16px; margin:0 10px;" class="btn btn-primary fr" id="check-date-30">30天</button>
                        <button style="padding:12px; font-size:16px;" class="btn fr" id="check-date-15">15天</button>
                    </div>`;
                }
            } else{
                headerHtml += `<p style="color:red;font-size:16px;">暂无数据或该员工没有绑定门店！</p>`;
            }
            this.tableWeek.children('.order-top').html(headerHtml);
            this.batchFn();
        }).then(() => {// 创建内容
            if(time === 'week'){
                this.creatWeek();
            } else{
                this.creatMonth(0,30);
            }
        }).then(() => {
            setTimeout(() => {
                layer.close(layer.index)
            }, 100);
        })

        this.tableWeek.on('click', '#check-date-60', function () {
            $('#check-date-30').removeClass('btn-primary');
            $('#check-date-15').removeClass('btn-primary');
            $('#check-date-60').addClass('btn-primary');
            that.toggleMonthTime(0, 60,save(true));
            that.currentTime = 60;
        })
        this.tableWeek.on('click', '#check-date-30', function () {
            $('#check-date-60').removeClass('btn-primary');
            $('#check-date-15').removeClass('btn-primary');
            $('#check-date-30').addClass('btn-primary');
            that.toggleMonthTime(0, 30,save(true));
            that.currentTime = 30;
        })
        this.tableWeek.on('click', '#check-date-15', function () {
            $('#check-date-30').removeClass('btn-primary');
            $('#check-date-60').removeClass('btn-primary');
            $('#check-date-15').addClass('btn-primary');
            that.toggleMonthTime(0, 15,save(true));
            that.currentTime = 15;
        })
        // 绑定取消事件
        $('.cancel-order-time').on('click', _cancel);
        // 取消排班
        function _cancel (){
            that.cancel();
        }
        // 获取排班数据
        $('.save-order-time').on('click',toSave);
        function toSave() {
            save(false)
        }
        function save(isSave = false){
            // 获取排班的值
            const td = $('.order-week-table td'),
                order_res_arr = [];
            for (let i = 0; i < td.length; i++) {
                const element = td[i];
                const time = $(element).children('.day');
                const am_id = $(element).children('.am').children('.content').attr('id');
                const pm_id = $(element).children('.pm').children('.content').attr('id');
                const am_content = $(element).children('.am').children('.content').text();
                const pm_content = $(element).children('.pm').children('.content').text();
                const am_order_times = $(element).children('.am').children('em').attr('data-id');
                const pm_order_times = $(element).children('.pm').children('em').attr('data-id');
                if (am_id || pm_id){
                    let obj = {};
                        obj.am = {};
                        obj.pm = {};
                        obj.am.id = am_id ? am_id : '';
                        obj.pm.id = pm_id ? pm_id : '';
                        obj.am.name = am_content ? am_content : '';
                        obj.pm.name = pm_content ? pm_content : '';
                        obj.am.orderTimes = am_order_times ? am_order_times : '';
                        obj.pm.orderTimes = pm_order_times ? pm_order_times : '';
                    obj[time.attr('name')] = time.text();
                    order_res_arr.push(obj)
                }
            }
            if (!isSave){
                that.toSaveOrder(order_res_arr,time)
            }
            return order_res_arr;
        }
        // 批量排班
        this.tableWeek.on('click', '#check-all-week-btn',function(){
            console.log('checked all week');
            that.setWeekOrder();
        });
        // 设置排班
        this.tableWeek.on('click', '.order-week-table td .content', _setOrderTime)
        function _setOrderTime (e){
            that.setSingleOrder(e)
        }
    };
    // 按周批量排班
    Order.prototype.batchFn = function(){
        const that = this;
        this.tableWeek.on('click', '.order-top .store-lists li', function(){
            const target = $(this);
            that.changeCheckedClass(target);
            // 获取当前选中值
            const text = target.children('span').text();
            const id = target.children('span').attr('data-id');
            that.checkObj.id  = id;
            that.checkObj.name = text;
            $('#check-all-week-btn').text(`全选${text}`);
            // console.log(that.checkObj);
        })
        this.tableWeek.on('click', '.order-top .order-date li', function(){
            const target = $(this);
            that.changeCheckedClass(target);
            // 获取当前选中值
            that.canOderId = target.attr('data-id');
            // console.log(that.canOderId);
        })
    };
    // 改变选择的样式
    Order.prototype.changeCheckedClass = function (target){
            target.siblings().removeClass('checked');
            target.siblings().children('i').removeClass('icon-yixuanze');
            target.siblings().children('i').addClass('icon-weixuanze');
            target.children('i').removeClass('icon-weixuanze');
            target.addClass('checked');
            target.children('i').addClass('icon-yixuanze');
    };
    // 保存排班
    Order.prototype.toSaveOrder = function(order,time){
        // console.log(arguments);
        /* if (order.length === 0){
            util.myLayer('请选择内容', 2);
            return false;
        } */
        let data = { empid: this.currentId };
        let url = '';
        if(time === 'week'){
            data.weektime = order;
            url = 'saveWeekTime';
        }else{// 保存月
            data.date = order;
            data.time = this.currentTime;
            url = 'saveDayTime';
        }
        ajax(Api(url, data)).then((res) => {
            if (res.data) {
                util.myLayer('保存成功！', 1);
                // 关闭
                this.cancel();
            }
        })
    };
    // 设置一周排班
    Order.prototype.setWeekOrder = function(){
        const ele_p = $('.order-week-table td .content');
        const content = this.checkObj.name;
        const id = this.checkObj.id;
        for (let i = 0; i < ele_p.length; i++) {
            const target = $(ele_p[i]);
            target.attr('id', id);
            target.parent().removeClass('out not');
            if (id == '-1') {
                target.parent().addClass('not');
                target.text('不出诊');
            } else {
                target.parent().addClass('out');
                target.text(content);
                target.siblings('em').text(`(${this.canOderId})`);
                target.siblings('em').attr('data-id', this.canOderId);
            }
        }
        
    };
    // 设置当个排班
    Order.prototype.setSingleOrder = function (e){
        const ele = $(e.target);
        ele.parent().removeClass('out not');
        const content = this.checkObj.name;
        const id = this.checkObj.id;
        // 如果有则删除，且和当前值相同则删除,否则就替换当前值显示选择项
        if (ele.attr('id')){
            ele.empty();
            ele.siblings('em').empty();
            ele.attr('id', '');
            return false;  
        } else if(id){
            ele.attr('id', id);
            if (id == '-1') {
                ele.parent().addClass('not');
                ele.text('不出诊');
            } else {
                ele.parent().addClass('out');
                ele.text(content);
                ele.siblings('em').text(`(${this.canOderId})`);
                ele.siblings('em').attr('data-id',this.canOderId);
            }
        }else{
            util.myLayer('未选择排班对象！',2);
        }
        
    }
    // 添加按周的元素
    Order.prototype.creatWeek = function(){
        // 获取排班
        ajax(Api('getWeekTime', { empid: this.currentId})).then((res) =>{
            return Promise.resolve(res);
        }).then((res) =>{
            let innerHtml = `
            <tr>
                <th>周一</th>
                <th>周二</th>
                <th>周三</th>
                <th>周四</th>
                <th>周五</th>
                <th>周六</th>
                <th>周日</th>
            </tr>
            <tr>`;
            const arr = [1,2,3,4,5,6,0],
                data = res.data;
            for (let i = 0; i < arr.length; i++) {
                const renderData = this.renderTemplate('week', data, arr[i]);

                innerHtml += `
                <td>
                    <em style="display:none;" name="week" class="day">${arr[i]}</em>
                    <span class="am ${renderData.amClass}">
                        <span class="time">上午</span>
                        <p class="content" id="${renderData.amId}">${renderData.amInner}</p>
                        <em class="order-time" data-id="${renderData.amTimesId}">${renderData.amTimesIner}</em>
                    </span>
                    <span class="pm ${renderData.pmClass}">
                        <span class="time">下午</span>
                        <p class="content" id="${renderData.pmId}">${renderData.pmInner}</p>
                        <em class="order-time" data-id="${renderData.pmTimesId}">${renderData.pmTimesIner}</em>
                    </span>
                </td>
                `
            }
            innerHtml += `
                </tr>
                `;
        const a =  document.getElementsByClassName('order-week-table');
            a[0].innerHTML = innerHtml;
        });
    };
    // 生成按月模板
    Order.prototype.creatMonth = function (){
        $('.order-week-table').empty();
        // 获取按天的排班
        ajax(Api('getDayTime', { empid: this.currentId })).then((res) => {
            return Promise.resolve(res);
        }).then((res) => {
            this.monthData = res.data;
            this.renderMonthHtml(0, 30, res.data)
        })
    };
    Order.prototype.toggleMonthTime = function (start, end, params){
        if (params) {// 如有改变日期，则合并,仅保留最小时间段修改的数据！
            let toData = params;
            const setTimeLength = (new Date()).getTime() + 24 * 60 * 60 * 1000 * (this.currentTime - 1);
            for (let i = 0; i < this.monthData.length; i++) {
                const item = this.monthData[i];
                const timeLength = new Date(item.day).getTime();
                if (setTimeLength < timeLength) {
                    toData.push(item);
                }
            }
            this.renderMonthHtml(start, end, toData);
        }
    };
    Order.prototype.renderMonthHtml = function (start, end, params, html_id = 'order-week-table',flag) {
        let html = ` `;
        // 获取当前的日历
        const myDate = new Date();
        // 获取星期
        let getWeek = new Date(myDate.getTime() + 24 * 60 * 60 * 1000 ).getDay();
        const showWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            newWeek1 = [], newWeek2 = [];
        showWeek.forEach((item, index) => {
            if (index >= getWeek) {
                newWeek1.push(item)
            } else {
                newWeek2.push(item)
            }
        })
        // 循环th
        html += `<tr>`;
        for (let i = 0; i < newWeek1.length; i++) {
            html += `<th>${newWeek1[i]}</th>`
        }
        for (let i = 0; i < newWeek2.length; i++) {
            html += `<th>${newWeek2[i]}</th>`
        }
        html += `</tr>`;
        // 获取30天
        if(flag){
            html += this.lookOrderStore(start, end, params);
        } else{
            html += this.dateComplet(start, end, params);
        }
        const a = document.getElementsByClassName(html_id);
        a[0].innerHTML = html;
    }
    // 读取排班模板
    Order.prototype.renderTemplate = function (day,data,time){
        let amInner = '', pmInner = '', amClass = '', amId = '', pmId = '', pmClass = '', pmTimesId = '', amTimesId = '', pmTimesIner = '', amTimesIner='';
        if (Array.isArray(data)) {
            for (let j = 0; j < data.length; j++) {
                const item = data[j];
                // 获取当前天
                if (item[day] == time) {
                    if (item.am && item.am.id) {
                        amId = item.am.id;
                        
                        if (item.am.id == '-1') {
                            amInner = '不出诊';
                            amClass = 'not';
                        } else if (item.am.id == '-2'){
                            amInner = '休店';
                            amClass = 'not-rest';
                        } else {
                            amInner = item.am.name;
                            amClass = 'out';
                            amTimesId = item.am.orderTimes ? item.am.orderTimes : 0;
                            amTimesIner = `(${amTimesId})`;
                        }
                    }
                    if (item.pm && item.pm.id) {
                        pmId = item.pm.id;
                        if (item.pm.id == '-1') {
                            pmInner = '不出诊';
                            pmClass = 'not';
                        } else if (item.pm.id == '-2') {
                            pmInner = '休店';
                            pmClass = 'not-rest';
                        } else {
                            pmTimesId = item.pm.orderTimes ? item.pm.orderTimes : 0;
                            pmClass = 'out';
                            pmInner = item.pm.name;
                            pmTimesIner = `(${pmTimesId})`;
                        }
                    }
                    break;
                }
            }
        }
        return { amInner, pmInner, amClass, amId, pmId, pmClass, amTimesId, pmTimesId, amTimesIner, pmTimesIner};
    }
    // 按店查询模板
    Order.prototype.lookOrderStore = function (start, end, data){
        let html = '';
        const myDate = new Date();
        for (let i = start; i < end; i++) {
            const a = new Date(myDate.getTime() + 24 * 60 * 60 * 1000 * (i + 1));
            const lastDate = util.fmtDate(a);

            if (i % 7 === 0) {
                html += `</tr><tr>`
            }
            let amInner = [], pmInner = [], amClass = '', pmClass = '',isRest = false;
            if (Array.isArray(data)) {
                for (let j = 0; j < data.length; j++) {
                    const item = data[j];
                    // 获取当前天
                    if (item.day == lastDate) {
                        const am = item.am;
                        const pm = item.pm;
                        if (item.rest == '-2'){
                            // 休店
                            isRest = true;
                            amClass = 'not-rest';
                            pmClass = 'not-rest';
                            break;
                        }
                        if (am.length > 0){
                            amClass = 'out';
                            amInner = am;
                        }
                        if (pm.length > 0) {
                            pmClass = 'out';
                            pmInner = pm;
                        }
                        break;
                    }
                }
            }

            html += `
                <td class="look-oreder-lis-warp">
                    <em name="day" class="day">${lastDate}</em>
                    <span class="look-oreder-lis am ${amClass}">
                        <span class="time">上午</span>
                        <ul>
            `;
            if (isRest){
                html += `休店`;
            } else{
                for (let j = 0; j < amInner.length; j++) {
                    const inner = amInner[j];
                    html += `<li data-id="${inner.id}">${inner.name}<em style="display:inline;">(${inner.orderTimes})</em></li>`;
                }
            }
            html += `</ul></span>`;
            html += `
                    <span class="look-oreder-lis pm ${pmClass}">
                        <span class="time">下午</span>
                        <ul>
            `;
            if (isRest){
                html += `休店`;
            } else{
                for (let j = 0; j < pmInner.length; j++) {
                    const inner = pmInner[j];
                    html += `<li data-id="${inner.id}">${inner.name}<em style="display:inline;">(${inner.orderTimes})</em></li>`;
                }
            }
            
            html += `</ul></span>
                    </span>
                </td>
            `;
            if (i === (end - 1)) {
                html += `</tr>`
            }
        }
        return html;
    }
    // 按天排班模板
    Order.prototype.dateComplet = function(start,end,data){
        let html = '';
        const myDate = new Date();
        for (let i = start; i < end; i++) {
            const a = new Date(myDate.getTime() + 24 * 60 * 60 * 1000 * (i+1));
            const lastDate = util.fmtDate(a);
            const renderData = this.renderTemplate('day', data, lastDate);
            if (i % 7 === 0) {
                html += `</tr><tr>`
            }
            html += `
                <td>
                    <em name="day" class="day">${lastDate}</em>
                    <span class="am ${renderData.amClass}">
                        <span class="time">上午</span>
                        <p class="content" id="${renderData.amId}">${renderData.amInner}</p>
                        <em class="order-time" data-id="${renderData.amTimesId}">${renderData.amTimesIner}</em>
                    </span>
                    <span class="pm ${renderData.pmClass}">
                        <span class="time">下午</span>
                        <p class="content" id="${renderData.pmId}">${renderData.pmInner}</p>
                        <em class="order-time" data-id="${renderData.pmTimesId}">${renderData.pmTimesIner}</em>
                    </span>
                </td>
            `;
            if (i === (end - 1)) {
                html += `</tr>`
            }
        }
        return html;
    }
    util.checkLogin().then(() => {
        util.getUserInfo();
        let order = order = new Order($('#order-table'), $('#order-week'));
        order.getOrder()
        order.getDoctorList();
        order.lookOrder();
    })
})

