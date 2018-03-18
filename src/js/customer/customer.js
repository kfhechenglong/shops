"use strict"
// import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'
import '../../css/index.less'

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
        }
        showOrder() {
            $('.off-customer').trigger('click');
        }
    }
    // 获取客户列表
    Customer.prototype.getCustomerList_fn = function (){
        const index = layer.load(2);
        const that = this;
        // 绑定添加
        this.add.on('click', function () {
            that.addNewCustomer();
            that.validator();
        });
        $('.customer-btn-add').on('click',function(){
            that.addNewCustomerBtn();
        });
        this.off.on('click',function(){
            that.offNewCustomer();
            that.clearValidator();
        } );
        ajax(Api('getCustomerList')).then((res) => {
            if (res.data) {// 请求成功，渲染列表
                const data = res.data,
                    length = data.length;
                this.customerList = data;
                let html = '';
                if (length > 0) {
                    html += '<thead>< tr > <th>客户姓名</th> <th>微信</th> <th>微信电话</th><th>联系方式</th><th>绑定电话</th><th>二维码</th>  <th>操作</th> </tr > </thead ><tbody>';
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <tr>
                            <td>${tr.name}</td>
                            <td>${tr.wxuid}</td>
                            <td>${tr.wxphone}</td>
                            <td>${tr.contact}</td>
                            <td>${tr.bind_phone}</td>
                            <td> 
                                <button data-qrcode="${tr.qrcode}" class="btn btn-info" id="customer-show-code-btn">二维码</button>
                                <button data-id="${tr.id}" class="btn btn-danger" id="customer-show-clear-btn">清除</button>
                            </td>
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
                    that.validator();
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
            }, 0);
        })
    };
    // 清除客户微信二维码
    Customer.prototype.clearCode = function(self){
        ajax(Api('clearCode', { 'customerid': $(self).attr('data-id')})).then((res) =>{
            util.myLayer('清除成功！', 1);
        })
    };
    // 显示客户微信绑定二维码
    Customer.prototype.showCode = function (self) {
        const url = $(self).attr('data-qrcode');
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
    };
    Customer.prototype.addNewCustomer = function () {
        this.add.hide();
        this.off.show();
        this.table.hide();
        this.form.show();
    };
    Customer.prototype.editCustomer = function (self){
        this.customerIsEdit = true;
        this.add.trigger('click');
        const currentId = $(self).parent().children("input").val();
        // 获取点击元素的信息
        let getData = {};
        for (let i = 0; i < this.customerList.length; i++) {
            const item = this.customerList[i];
            if (currentId == item.id) {
                getData = Object.assign({}, item);
                break
            }
        }
        // 将员工信息赋值给input
        const form = this.form;
        form.find('input[name="id"]').val(currentId);
        form.find('input[name="name"]').val(getData.name);
        form.find('input[name="contact"]').val(getData.contact);
        form.find('input[name="bind_phone"]').val(getData.bind_phone);
    };
    // 表单验证
    Customer.prototype.validator = function(){
        const options = Object.assign(Object.assign({}, util.validatorOptions), {
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '客户名不能为空'
                        },
                        stringLength: {
                            min: 2,
                            max: 30,
                            message: '客户名长度不能小于2位或超过30位'
                        },
                        regexp: {
                            regexp: /^[A-Za-z\u4e00-\u9fa5]+$/,
                            message: '客户名只能由字母、汉字组成。'
                        },
                    }
                },
                pass: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空！'
                        },
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
                },
                contact: {
                    validators: {
                        notEmpty: {
                            message: '联系方式不能为空！'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '只能是数字！'
                        }
                    }
                },
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
        this.form.data('bootstrapValidator').destroy();
        this.form.data('bootstrapValidator', null); 
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
            for (let i = 0; i < form.length; i++) {
                const item = form[i];
                obj[item.name] = item.value;
            }
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
        this.off.hide();
        this.add.show();
        this.table.show();
        this.form.hide();
        // 清空表格内容
        $(':input', this.form).val('');
        // util.clearFormContent(this.form);
    };

    // 实例化;
    const new_customer = new Customer($('.customer-form'), $('.customer-table'), $('.off-customer'), $('.add-customer'));
    new_customer.showOrder();
    new_customer.getCustomerList_fn();

    
})

