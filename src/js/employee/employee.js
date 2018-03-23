"use strict"
import './../common/index-main.js'
import util from './../common/util.js'


// 获取公司信息
$(document).ready(()=>{
    const employee = $('.employee'),
        editEmployee = $('.edit-employee'),
        employeeTable = $('.employee-table'),
        employeeForm = $('.employee-form'),
        flag = {
        };

    
    // 员工列表信息
    let employeeList = [];
    let rolesList = [];
    let emStoreList = [];
    let checkStoreId = new Set();
    let editId = '';
    let listArr = [];
    // 定义表单验证
    const employee_options = (edit) => {
        const name = util.validatorName('姓名');
        const pass = util.validatorPass();
        const contact = util.validatorContact();
        let obj =  {};
        if (edit){
            obj = {
                name: name,
                pass: {
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
                },
                employeePasswordTwo: {
                    validators: {
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: '密码只能由字母、数字和下划线。'
                        },
                        identical: {//与指定文本框比较内容相同  
                            field: 'pass',
                            message: '两次输入密码不匹配'
                        },
                    }
                },
                contact: contact
            }
        }else{
            obj = {
                name: name,
                pass: pass,
                employeePasswordTwo: {
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
                        identical: {//与指定文本框比较内容相同  
                            field: 'pass',
                            message: '两次输入密码不匹配'
                        },
                    }
                },
                contact: contact
            }
        }
        return Object.assign({}, Object.assign(
            Object.assign({}, util.validatorOptions),
            { fields: obj }));
    }
     
    // 获取员工列表
    function getEmpList(list){
        // 获取员工管理信息
        let html = "";
        const index = layer.load(2);
        ajax(Api('getEmpList')).then((res) => {
            const data = res.data,
                length = data.length;
                employeeList = data;
            if (length > 0){
                html += '<thead>< tr > <th>员工姓名</th><th>微信昵称</th> <th>员工类型</th> <th>联系方式</th><th>绑定操作</th>  <th>操作</th> </tr > </thead ><tbody>';
                for (let i = 0; i < length; i++) {
                    const tr = data[i];
                    html +=  `
                        <tr>
                            <td>${tr.name}</td>
                            <td>${tr.nickname}</td>
                            <td><ul class="td-ul">
                            `;
                    const roles = tr.roles;
                    html += util.renderTd(roles, list, '店铺', 'storeid');
                    html +=  `</ul></td><td>${tr.contact} </td>`;
                    
                    if (tr.openid){
                        html +=  `
                            <td>
                                <button data-id="${tr.id}" class="btn btn-primary" id="employee-code-btn">二维码</button>
                                <button data-id="${tr.id}" class="btn btn-danger" id="employee-uncode-btn">解绑</button>
                            </td>`;
                    } else{
                        html += `
                            <td><button data-id="${tr.id}" class="btn btn-primary" id="employee-code-btn">二维码</button></td>`;
                    }
                    let again_btn = 'none';
                    let not_btn = 'inline-block';
                    if (tr.isblock !== '0') {
                        again_btn = 'inline-block';
                        not_btn = 'none';
                    } 
                    html +=  `
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="employee-edit-btn">编辑</button>
                                <button style="display:${again_btn}" data-id="${tr.id}" class="btn btn-info" id="employee-delet-btn">启用</button>
                                <button style="display:${not_btn}" data-id="${tr.id}" class="btn btn-danger" id="employee-delet-btn">禁用</button>
                            </td>
                        </tr>
                        `;
                }
                html += `</tbody>`;
            } else {
                html = `<p>暂无数据！</p>`
            }
            util.addHtml(employeeTable, html);
        }).then(() => {
            setTimeout(() => {
                layer.close(layer.index)
            }, 200);
        })
        // 渲染员工信息表
    }
    // 解绑员工微信
    employee.on('click','#employee-uncode-btn',function(){
        ajax(Api('clearBindEmp', { 'empid': $(this).attr('data-id') })).then((res) => {
            if(res.data){
                util.myLayer('员工解绑成功！', 1)
                creatEmpContent();
            }else{
                util.myLayer('员工解绑失败！',2)
            }
        })
    })
    // 员工管理
    util.checkLogin().then(() => {
        util.getUserInfo();
        creatEmpContent();
    });
    function creatEmpContent() {
        flag.edit = false;
        //获取门店和类型列表
        const obj_options_select = {
            url1: 'getRoles',
            url2: 'getStoreList',
            store: '#checkedStore',
            roles: '#checkedRoles',
            add_list: '.add-store-soles',
            dele_list: 'delet-store-soles',
            warpul: '#bind-store1 ul',
            warp: '#bind-store1',
            text: '店铺'
        }
        util.getSelectList(obj_options_select).then((res) =>{
            listArr = res;
            getEmpList(res);
            util.setRenderSelectList(obj_options_select, res, checkStoreId);
        });
    }
    // 绑定员工二维码
    employee.on('click','#employee-code-btn',function(){
        ajax(Api('getEmpQrcode', { 'empid': $(this).attr('data-id') })).then((res) => {
            if (res) {
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
            } else {
                util.myLayer('获取二维码失败！', 2);
            }
        })
    });
    //编辑员工信息
    employee.on('click', '#employee-edit-btn',function () {
        editId = $(this).parent().children("input").val();
        // $('.edit-employee').trigger("click");
        employeeForm.bootstrapValidator(employee_options(true))
        editEmployee.text('取消');
        btn_inner = "cancal";
        employeeTable.hide();
        employeeForm.show();
        // 获取点击元素的信息
        ajax(Api('getEmp', { empid: editId })).then((res) => {
            const data = res.data;
             // 将员工信息赋值给input
            const form = employeeForm;
            form.find('input[name="name"]').val(data.name);
            form.find('input[name="contact"]').val( data.contact);
            // form.find('input[name="pass"]').val( data.pass);
            // form.find('input[name="employeePasswordTwo"]').val( data.pass);
            form.find('input[name="usertype"]').val( data.usertype);
            flag.edit = true;
            // 渲染已绑定门店角色的列表
            if (data.typeRoles.length > 0){
                const roles = data.typeRoles;
                for (let i = 0; i < roles.length; i++) {
                    const item = roles[i];
                    checkStoreId.add(item.storeId.id);
                    let html = '';
                    html += util.creatHtml1('店铺', item.storeId);
                    for (let j = 0; j < listArr[0].length; j++) {
                        const ele = listArr[0][j];
                        let a = true;
                        if (item.rolesId) {
                            for (let k = 0; k < item.rolesId.length; k++) {
                                const rolesEle = item.rolesId[k];
                                if (rolesEle.id == ele.id){
                                    a = false;
                                    html += util.creatHtmlSpan(rolesEle, true, 'checked','icon-yixuanze');
                                    break;
                                }
                            }
                        }
                        if(a){
                            html += util.creatHtmlSpan(ele, true);
                        }
                    }
                    // 修改头部样式
                    util.restClassName($('#checkedStore li'), item.storeId.id);
                    html += util.creatHtmlBtn(item.storeId.id,'delet-store-soles');
                    $('#bind-store1 ul').append(html);
                }
            }
        })
        
    });
    // 删除员工
    employee.on('click', '#employee-delet-btn',function () {
        const data = { 'empid':$(this).attr('data-id')};
        util.deletList('empBlock', getEmpList, data,listArr);
    });

    
    // 添加员工
    let btn_inner = "edit";
    editEmployee.on('click', () => {
        if (btn_inner === 'cancal') {
            flag.edit = false;
            // 点击取消时，清空表单内容
            console.log('取消')
            util.clearFormContent(employeeForm);
            // 清除表单验证
            employeeForm.data('bootstrapValidator').destroy();
            employeeForm.data('bootstrapValidator', null);
            editEmployee.text('添加');
            btn_inner = "edit";
            // 模板渲染
            employeeTable.show();
            employeeForm.hide();
            // 清空
            checkStoreId.clear();
            $('#bind-store1 ul').empty();
            $('#checkedRoles').selectpicker('refresh');
        } else {
            // 设置样式
            util.toggleClass($('#checkedStore li'));
            // 初始化表单验证
            employeeForm.bootstrapValidator(employee_options())
            editEmployee.text('取消');
            btn_inner = "cancal";
            employeeTable.hide();
            employeeForm.show();
        }
    });

    // 添加员工表单验证
    $(".employee-btn-add").click(function () {
        console.log(flag)
        employeeForm.bootstrapValidator('validate');//提交验证  
        if (employeeForm.data('bootstrapValidator').isValid()) {
            // 获取表单数据
            const data = employeeForm.serializeArray();
            let postdata = {};
            data.forEach((item)=>{
                if(item.name !== 'employeePasswordTwo'){
                    postdata[item.name] = item.value;
                }
            });
            let url = 'addEmp';
            if (flag.edit){
                url = 'updateEmp';
                postdata = Object.assign(postdata, { empid: editId});
            }
            // 获取绑定门店的id值
            const a = util.getSelectedValue();
            if(!a) return false;

            postdata = Object.assign(postdata, { typeRoles: a });
            ajax(Api(url,postdata)).then((res) => {
                if(res){
                    employeeForm[0].reset();
                    getEmpList(listArr)
                    // 添加成功，
                    $(".edit-employee").trigger("click")
                }else{
                    util.myLayer('请求失败！', 5);
                }
                
            })
        }
    });
  
})

