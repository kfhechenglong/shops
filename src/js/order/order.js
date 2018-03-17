"use strict"
import './../common/index-main.js'
import util from './../common/util.js'
import '../../css/index.less'


// 获取公司信息
$(document).ready(()=>{

    /* 
        排班管理
    */
    class Order {
        constructor (a,b){
            this.tableList = a;
            this.tableWeek = b;
        }
        
        // 获取列表
        getOrder(){
            this.showOrder()
        }
        showOrder(){
            // $('.order').show();
            // customer.hide();
            // store.hide();
            // company.hide();
            // employee.hide();
            this.cancel();
        }
        
    }
    // 获取列表
    Order.prototype.getDoctorList = function(){
        const that = this;
        ajax(Api('getEmpList')).then((res) => {
            let html = '';
            const data = res.data,
                length = data.length;
            this.doctorList = data;
            if (length > 0) {
                html += '<thead><tr> <th>序号</th><th>员工姓名</th><th>角色</th><th>排班</th> </tr > </thead><tbody>';
                for (let i = 0; i < length; i++) {
                    const tr = data[i];
                    html += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${tr.name}</td>
                            <td>${tr.usertype}</td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="order-week-btn">按周</button>
                                <button class="btn btn-danger" id="order-month-btn">按天</button>
                            </td>
                        </tr>
                        `;
                }
                html += `</tbody>`;
            } else {
                html = `<p>暂无数据！</p>`
            }
            const eleList = this.tableList;
            eleList.empty();
            eleList.append(html);
            const _show_week = function(){
                that.currentId = $(this).parent().children("input").val();
                that.selectList('week')
            };
            const _show_month = function(){
                that.currentId = $(this).parent().children("input").val();
                that.selectList('month')
            };
            this.tableList.unbind("click");
            this.tableList.on('click', '#order-week-btn', _show_week)
            this.tableList.on('click', '#order-month-btn', _show_month)
        })
    };
    Order.prototype.getStoreList = function(){
        return new Promise((resolve,reject) => {
            ajax(Api('getStoreList')).then((res) => {
                let html = `
                    <label class="checkbox-inline">
                        <input name="checkStore" type="radio" value="-1">不出诊
                    </label>
                `;
                const data = res.data,
                    length = data.length;
                this.storeList = data;
                if (length > 0) {
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <label class="checkbox-inline">
                                <input name="checkStore" type="radio" value="${tr.id}">${tr.name}
                            </label>
                            `;
                    }
                } else {
                    html = `<p>暂无数据！</p>`
                }
                const eleList = $('.order-week-inner-form');
                eleList.empty();
                eleList.append(html);
                resolve(data)
            })
        })
        
    }
    Order.prototype.cancel = function (){
        this.tableList.show();
        this.tableWeek.hide();
        // 解绑事件
        $('.save-order-time').unbind("click");
        $('.cancel-order-time').unbind("click");
        $('.order-week-modal-on').unbind("click");
        $('#order-week').unbind("click");
    }
    // 按周按月排班
    Order.prototype.selectList = function (time) {
        const that = this;
        this.tableList.hide();
        this.tableWeek.show();
        // 获取当前的人医生姓名
        for (let i = 0; i < this.doctorList.length; i++) {
            const person = this.doctorList[i];
            if(person.id === this.currentId){
                this.name = person.name;
                break
            }
        }
        this.tableWeek.children('p').html(`<p>当前医生：${this.name}</p>`);
        // 创建内容
        if(time === 'week'){
            this.creatWeek();
        } else{
            this.creatMonth();
        }
        // 绑定取消事件
        $('.cancel-order-time').on('click', _cancel);
        // 取消排班
        function _cancel (){
            that.cancel();
        }
        // 获取排班数据
        $('.save-order-time').on('click',save);
        function save(){
            // 获取排班的值
            const td = $('.order-week-table td'),
                order_res_arr = [];
            for (let i = 0; i < td.length; i++) {
                const element = td[i];
                const time = $(element).children('.day');
                const am_content = $(element).children('.am').children('.content').attr('id');
                const pm_content = $(element).children('.pm').children('.content').attr('id');
                if (am_content || pm_content){
                    let obj = {
                        am: am_content ? am_content : '',
                        pm: pm_content ? pm_content : ''
                    };
                    obj[time.attr('name')] = time.text();
                    order_res_arr.push(obj)
                }
            }
            that.toSaveOrder(order_res_arr,time)
        }
        let ele = '';
        // 获取店面列表
        this.getStoreList().then((res) => {
            this.tableWeek.on('click', '.order-week-table td .content', _showModal)
        });
        function _showModal (e){
            ele = e.target;
            that.showModal(e)
        }
        $('.order-week-modal-on').on('click',function(){
            // console.log(that.storeList)
            let content = '';
            const id = $('.order-week-inner-form').serializeArray()[0].value;
            for (let i = 0; i < that.storeList.length; i++) {
                const ele = that.storeList[i];
                if(id == ele.id){
                    content = ele.name;
                    break
                }
            }
            $(ele).empty();
            $(ele).attr('id', '');
            $(ele).attr('id', id);
            if (id == '-1') {
                $(ele).parent().addClass('not');
                $(ele).text('不出诊');
            } else {
                $(ele).parent().addClass('out');
                $(ele).text(content)
            }
        });
    };
    // 保存排班
    Order.prototype.toSaveOrder = function(order,time){
        // console.log(arguments);
        if (order.length === 0){
            util.myLayer('请选择内容', 2);
            return false;
        }
        let data = { empid: this.currentId };
        let url = '';
        if(time === 'week'){
            data.weektime = order;
            url = 'saveWeekTime';
        }else{// 保存月
            data.date = order;
            url = 'saveDayTime';
        }
        ajax(Api(url, data)).then((res) => {
            if (res.data) {
                util.myLayer('保存成功！', 1);
                // 关闭
                this.cancel();
            }
        })
    }
    Order.prototype.showModal = function (e){
        let ele = e.target;
        $(ele).parent().removeClass('out not');
        // 如果有则删除，没有则显示选择项
        if($(ele).html()){
            $(ele).empty();
            $(ele).attr('id', '');
            return false;  
        } 
        // 显示模态框
        $('#myModal-order').modal('show')
    }
    // 添加按周的元素
    Order.prototype.creatWeek = function(){
        // 获取排班
        $('.order-week-table').empty();
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
                let amInner = '',
                    pmInner = '',
                    amClass = '',
                    amId = '',
                    pmId = '',
                    pmClass = '';
                if (Array.isArray(data) ){
                    
                    for (let j = 0; j < data.length; j++) {
                        const item = data[j];
                        // 获取当前天
                        if (item.week == arr[i]){
                            if (item.am.id){
                                amId = item.am.id;
                                if(item.am.id == '-1'){
                                    amInner = '不出诊';
                                    amClass = 'not';
                                }else{
                                    amInner = item.am.name;
                                    amClass = 'out';
                                }
                            } 
                            if (item.pm.id){
                                pmId = item.pm.id;
                                if (item.pm.id == '-1') {
                                    pmInner = '不出诊';
                                    pmClass = 'not';
                                } else{
                                    pmClass = 'out';
                                    pmInner = item.pm.name;
                                }
                            } 
                            break;
                        }
                    }
                }
                innerHtml += `
                <td>
                    <em style="display:none;" name="week" class="day">${arr[i]}</em>
                    <span class="am ${amClass}">
                        <span class="time">上午</span>
                        <p class="content" id="${amId}">${amInner}</p>
                    </span>
                    <span class="pm ${pmClass}">
                        <span class="time">下午</span>
                        <p class="content" id="${pmId}">${pmInner}</p>
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
    Order.prototype.creatMonth = function(){
        let html = ` `;
        // 获取当前的日历
        const myDate = new Date();
        // 获取星期
        let getWeek = new Date(myDate.getTime()).getDay();
        const showWeek = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        const newWeek1 = [];
        const newWeek2 = [];
        showWeek.forEach((item,index)=>{
            if (index >= getWeek){
                newWeek1.push(item)
            }else{
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
        // 获取按天的排班
        ajax(Api('getDayTime', { empid: this.currentId })).then((res) => {
            return Promise.resolve(res);
        }).then((res) => {

        })
        // 循环td
        for (let i = 0; i < 30; i++) {
            const lastDate = new Date(myDate.getTime() + 24 * 60 * 60 * 1000 * i).toLocaleDateString();
            if( i % 7 === 0 ){
                // console.log(i)
                html += `</tr><tr>`
            }
            html += `
                <td>
                    <em name="day" class="day">${lastDate}</em>
                    <span class="am">
                        <span class="time">上午</span>
                        <p class="content"></p>
                    </span>
                    <span class="pm">
                        <span class="time">下午</span>
                        <p class="content"></p>
                    </span>
                </td>
            `;
            if (i === 29 ) {
                html += `</tr>`
            }
        }
        $('.order-week-table').empty();
        const a = document.getElementsByClassName('order-week-table');
        a[0].innerHTML = html;
    }
    let order = "";
        if (!util.checkType(order,'Object')){
            order = new Order($('#order-table'), $('#order-week'));
        }
        
        order.getOrder()
        order.getDoctorList();
    
})

