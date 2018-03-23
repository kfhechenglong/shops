"use strict"
// import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'

// 获取公司信息
$(document).ready(()=>{
    /* 
        客户管理
    */
    const customer = $('.customer');
    class Customer{
        constructor(a,b,c,d){
            this.form = a;
            this.table = b;
            this.off = c;
            this.add = d;
            this.customerIsEdit = false ;
            this.store_bind_id ='';
            this.storeListsData = [];
            this.currentEditData = {};
        }
        showOrder() {
            $('.off-customer').trigger('click');
            this.getStoreLists()
        }
    }
    // 获取门店列表
    Customer.prototype.getStoreLists = function() {
        ajax(Api('getStoreList')).then((res) => {
            if(res){
                this.storeListsData = res.data;
            } else {
                utli.myLayer('获取门店列表失败！', 2);
            }
        })
    }
    // 获取客户列表
    Customer.prototype.getCustomerList_fn = function (){
        const index = layer.load(2);
        const that = this;
        console.time()
        ajax(Api('getCustomerList')).then((res) => {
            console.timeEnd()
            if (res.data) {// 请求成功，渲染列表
                const data = res.data,
                    length = data.length;
                this.customerList = data;
                let html = '';
                if (length > 0) {
                    html += '<thead>< tr > <th>客户姓名</th><th>微信昵称</th> <th>微信电话</th><th>联系方式</th><th>绑定电话</th><th>创建方式</th><th>绑定操作</th>  <th>操作</th> </tr > </thead ><tbody>';
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <tr>
                            <td>${tr.name}</td>
                            <td>${tr.nickname}</td>
                            <td>${tr.c_phone}</td>
                            <td>${tr.contact}</td>
                            <td>${tr.bind_phone}</td>
                            <td>${tr.create_by_type}</td>
                        `;
                        if(tr.openid){
                             html += `
                                <td> 
                                    <button data-id="${tr.id}" data-qrcode="${tr.qrcode}" class="btn btn-primary" id="customer-show-code-btn">二维码</button>
                                    <button data-id="${tr.id}" class="btn btn-danger" id="customer-show-clear-btn">解绑</button>
                                </td>
                            `;
                        } else{
                            html += `
                                <td> 
                                    <button data-id="${tr.id}" data-qrcode="${tr.qrcode}" class="btn btn-primary" id="customer-show-code-btn">二维码</button>
                                </td>
                            `;
                        }
                        html += `
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="customer-edit-btn">编辑</button>
                            </td>
                        </tr>
                        `;
                    }
                    html += `</tbody>`;
                } else {
                    html = `<p>暂无数据！</p>`
                }
                util.addHtml(this.table, html);
                // close loading
                customer.on('click', '#customer-delet-btn', function () {
                    deletList('deletStore', that.getCustomerList_fn);
                });
                customer.on('click', '#customer-edit-btn',function(){
                    that.editCustomer(this);
                    that.validator(true);
                } );
                customer.on('click', '#customer-show-code-btn',function(){
                    that.showCode(this);
                } );
                customer.on('click', '#customer-show-clear-btn',function(){
                    that.clearCode(this);
                } );
            }
        }).then(() => {
            setTimeout(() => {
                layer.close(layer.index)
            }, 200);
        })
        // 绑定添加
        this.add.on('click', function () {
            that.addNewCustomer();
            that.validator();
        });
        
        this.off.on('click', function () {
            that.offNewCustomer();
            that.clearValidator();
            that.store_bind_id = '';
        });
    };
    // 清除客户微信二维码
    Customer.prototype.clearCode = function(self){
        ajax(Api('clearCode', { 'customerid': $(self).attr('data-id')})).then((res) =>{
            if(res){
                util.myLayer('客户解绑成功！', 1);
                this.getCustomerList_fn();
            } else{
                util.myLayer('客户解绑失败！', 2);
            }
            
        })
    };
    // 显示客户微信绑定二维码
    Customer.prototype.showCode = function (self) {
        // 获取客户二维码
        ajax(Api('getCustomerQrcode', { 'customerid': $(self).attr('data-id') })).then((res) =>{
            if(res){
                const url = res.data;
                $('#myModal-company').modal('show')
                const html = `
                        <div class="modal-body">
                            <div style="width:450px; height:450px;margin:0 auto;">
                                <iframe id="wxcode" src="${url}" frameborder="0" scrolling="no"  width="100%" height="100%;"></iframe>
                            </div>
                            
                        </div>
                    `;
                $('#myModal-company-inner').empty();
                $('#myModal-company-inner').append(html);
            }else{
                util.myLayer('获取二维码失败！', 2);
            }
        })
        
    };
    Customer.prototype.addNewCustomer = function () {
        // 获取门店列表
        const that = this;
        
        this.add.hide();
        this.off.show();
        this.table.hide();
        this.form.show();
        let html = '';
        if (this.storeListsData.length > 0){
            for (let i = 0; i < this.storeListsData.length; i++) {
                const item = this.storeListsData[i];
                html += `<li class="fl store-item" data-id="${item.id}"><i class="iconfont icon-weixuanze"></i> <span>${item.name}</span></li>`
            }
        } else {
            html = '暂无门店列表！您无法添加客户！'
        }
        util.addHtml($('.store-list-customer'), html);
        $('.customer-btn-add').on('click', function () {
            that.addNewCustomerBtn();
        });
        $('.store-list-customer').on('click','li',function(){
            // 编辑状态不可操作
            if (!that.customerIsEdit || that.currentEditData.storeid === '0'){
                const target = $(this);
                that.store_bind_id = target.attr('data-id');
                util.addClass(target);
                target.siblings().removeClass('checked');
                target.siblings().children('i').removeClass('icon-yixuanze');
                target.siblings().children('i').addClass('icon-weixuanze');
            } else{
                util.myLayer('已绑定门店不可修改！',4);
            }
        })
    };
    Customer.prototype.editCustomer = function (self){
        this.customerIsEdit = true;
        this.addNewCustomer();
        const currentId = $(self).parent().children("input").val();
        // 获取点击元素的信息
        let getData ={};
        for (let i = 0; i < this.customerList.length; i++) {
            const item = this.customerList[i];
            if (currentId == item.id) {
                getData = Object.assign({}, item);
                break
            }
        }
        this.currentEditData = getData;
        // 将员工信息赋值给input
        const form = this.form;
        form.find('input[name="id"]').val(currentId);
        form.find('input[name="name"]').val(getData.name);
        form.find('input[name="contact"]').val(getData.contact);
        form.find('input[name="bind_phone"]').val(getData.bind_phone);
        this.store_bind_id = getData.storeid;
        // 获取门店列表
        try {
            const lis = $('.store-list-customer li');
            util.restClassName(lis, getData.storeid)
        } catch (error) {
            console.log('没有门店列表！');
        }
        
    };
    // 表单验证
    Customer.prototype.validator = function(isEdit){
        let passOption = util.validatorPass();
        if (isEdit){
            passOption = {
                validators: {
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码长度不能小于6位或超过30位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能由字母、数字和下划线。'
                    },
                }
            };
        }
        const options = Object.assign(Object.assign({}, util.validatorOptions), {
            fields: {
                name: util.validatorName('客户'),
                pass: passOption,
                contact: util.validatorContact(),
                bind_phone: {
                    validators: {
                        notEmpty: {
                            message: '手机号不能为空！'
                        },
                        regexp: {
                            regexp: /^1[3|5|6|7|8|9]\d{9}$/,
                            message: '手机号格式不正确！'
                        }
                    }
                }
            }});
        
        this.form.bootstrapValidator(options);
    };
    Customer.prototype.clearValidator = function(){
        try {
            this.form.data('bootstrapValidator').destroy();
            this.form.data('bootstrapValidator', null); 
        } catch (error) {
            
        }
    };
    Customer.prototype.addNewCustomerBtn = function (){
        this.form.bootstrapValidator('validate');//提交验证  
        if (this.form.data('bootstrapValidator').isValid()) {
            // 获取表单内容
            const form = this.form.serializeArray(),
                obj = {};
            let api = 'addCustomer',
                msg = '添加成功！';
            if (this.customerIsEdit) {//编辑客户
                api = 'updateCustomer';
                msg = '更新成功！';
                obj.customerid = form[1].value
            }
            if (!this.store_bind_id || this.store_bind_id === '0'){
                util.myLayer('请选择绑定的门店', 2);
                return false;
            }
            for (let i = 0; i < form.length; i++) {
                const item = form[i];
                obj[item.name] = item.value;
            }
            obj.storeid = this.store_bind_id;
            ajax(Api(api, obj)).then((res) => {
                if (res) {
                    util.myLayer(msg, 1);
                    this.off.trigger('click');
                    // 重新获取列表
                    this.getCustomerList_fn();
                } else {
                    util.myLayer('操作失败！', 5);
                }
            });
        }
    };
    Customer.prototype.offNewCustomer = function () {
        this.customerIsEdit = false;
        this.currentEditData = {};
        this.off.hide();
        this.add.show();
        this.table.show();
        this.form.hide();
        // 清空表格内容
        $(':input', this.form).val('');
        $('.store-list-customer').unbind('click');
        $('.customer-btn-add').unbind('click');
    };

    // 实例化;
    util.checkLogin().then(() => {
        util.getUserInfo();
        const new_customer = new Customer($('.customer-form'), $('.customer-table'), $('.off-customer'), $('.add-customer'));
        new_customer.showOrder();
        new_customer.getCustomerList_fn();
    })
})

