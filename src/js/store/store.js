"use strict"
import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'


// 获取公司信息
$(document).ready(()=>{

    const store = $('.store'),
        flag = {
        };
    /* 
    门店管理逻辑
    
    */
    /* 门店地址 */
    
    let storeLists = [];//门店列表
    let isEdit = false;//是否是编辑状态
    let currentStoreId = '';//当前门店id
    let emlistId = new Set();//当前门店id
    let selectEmId = new Set();//已绑定员工的id 列表
    let listArr = [];
    const getStoreList_fn = (list) =>{
        const index = layer.load(2);
        ajax(Api('getStoreList')).then((res) => {
            if (res) {
                const data = res.data;
                storeLists = data;
                const length = data.length;
                let html = '';
                if (length > 0) {
                    html += '<thead>< tr > <th>序号</th> <th>店名</th><th>操作员</th> <th>联系方式</th><th>地址</th><th>二维码</th><th>休店</th><th>操作</th> </tr > </thead ><tbody>';
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${tr.name}</td>
                            <td><ul class="td-ul">
                        `;
                        const roles = tr.roles;
                        html += util.renderTd(roles, list, '员工','empid');
                        html += `</ul></td>
                            <td>${tr.contact} </td>
                            <td style="max-width:130px;">${tr.input_province}${tr.input_city}${tr.input_area}${tr.addr_detail}</td>
                            <td> 
                                <button data-id="${tr.qrcode}" class="btn btn-primary" id="store-code-btn">获取</button>
                            </td>
                            <td> 
                                <button data-id="${tr.id}" class="btn btn-primary" id="store-rest-btn">设置</button>
                            </td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="store-edit-btn">编辑</button>
                        `;
                        let again_btn = 'none';
                        let not_btn = 'inline-block';
                        if(tr.isblock !== '0'){
                            again_btn = 'inline-block';
                            not_btn = 'none';
                        } 
                        html += `<button data-id="${tr.id}" style="display: ${again_btn}" class="btn btn-info" id="store-delet-btn">启用</button>`;
                        html += `<button data-id="${tr.id}" style="display: ${not_btn}" class="btn btn-danger" id="store-delet-btn">禁用</button>`;
                        html += `</td></tr>`;
                    }
                    html += `</tbody>`;
                } else {
                    html = `<p>暂无数据！</p>`
                }
                util.addHtml($('.store-table'), html);
            }
        }).then(() => {
            setTimeout(() => {
                layer.close(layer.index)
            }, 100);
        });
    }
    util.checkLogin().then(() => {
        util.getUserInfo();
        
        const obj_options_select = {
            url1: 'getRoles',
            url2: 'getEmpList',
            store: '#select-store-id',
            roles: '#select-store-roles',
            add_list: '#add-store-soles-2',
            dele_list: 'delet-store-soles-list',
            warpul: '#bind-em-roles ul',
            warp: '#bind-em-roles',
            text: '员工'
        }
        util.getSelectList(obj_options_select).then((res) => {
            listArr = res;
            getStoreList_fn(res);
            util.setRenderSelectList(obj_options_select, res, selectEmId);
        });
    });

    // 实例化地图
    function creatMap(address) {
        const map = new BMap.Map("store-map");
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();
        if (address){
            const a = address.input_province + address.input_city + address.input_area;
            console.log(a);
            map.setCenter(a)
            // 初始化地图,设置城市和地图级别。
            map.centerAndZoom(a, 12);
            
        }else{
            // 获取经纬度
            const geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    console.log(r.address.city);
                    // var mk = new BMap.Marker(r.point);
                    map.setCenter(r.address.city)
                    // 初始化地图,设置城市和地图级别。
                    map.centerAndZoom(r.address.city, 12);
                }
                else {
                    alert('failed' + '获取定位失败！');
                }
            });
        }
        // 获取选择的地区地址
        let input_province = "";
        let input_city = "";
        let input_area = "";
        $("#input_province").change(function (e) {
            input_province = e.target.value;
            map.centerAndZoom(input_province, 12);
            map.clearOverlays();
        });
        $("#input_city").change(function (e) {
            input_city = e.target.value;
            map.centerAndZoom(input_province + input_city, 12);
            map.clearOverlays();
        });
        $("#input_area").change(function (e) {
            input_area = e.target.value;
            map.centerAndZoom(input_province + input_city + input_area, 13);
            map.clearOverlays();
        })
        // 获取点击地图地址
        function getClickAddress(e) {
            const geoc = new BMap.Geocoder();
            let pt = e.point
            geoc.getLocation(pt, function (res) {
                const addComp = res.addressComponents;
                console.log(addComp)
                let site = '';
                // 判断是否有门牌及街道号
                if (!addComp.streetNumber && res.surroundingPois.length > 0) {
                    if (addComp.street) {
                        site = addComp.street + res.surroundingPois[0].title;
                    } else {
                        site = res.surroundingPois[0].title;
                    }
                } else if (!addComp.streetNumber && res.surroundingPois.length === 0) {
                    site = '';
                } else {
                    site = addComp.street + addComp.streetNumber;
                }
                const myValue = addComp.province + addComp.city + addComp.district + site;
                //将对应的HTML元素设置值
                $('#addr_detail').val(site);
                if (addComp.province === addComp.city) {
                    $("#input_province").val(addComp.province);
                    $("#input_province").trigger('change')
                    $("#input_city").val(addComp.district);
                    $("#input_city").trigger('change')
                } else {
                    $("#input_province").val(addComp.province);
                    $("#input_province").trigger('change')
                    $("#input_city").val(addComp.city);
                    $("#input_city").trigger('change')
                    $("#input_area").val(addComp.district);
                }
                map.clearOverlays();    //清除地图上所有覆盖物
                map.centerAndZoom(pt, 20);
                const marker = new BMap.Marker(pt);
                map.addOverlay(marker);    //添加标注

                var removeMarker = function (e, ee, marker) {
                    map.removeOverlay(marker);
                    $('#addr_detail').val('');
                }
                //创建右键菜单
                var markerMenu = new BMap.ContextMenu();
                markerMenu.addItem(
                    new BMap.MenuItem('删除', removeMarker.bind(marker))
                );
                marker.addContextMenu(markerMenu);
            });
        }
        map.addEventListener("click", getClickAddress);

    };
    const callFn = {
        validators: {
            callback: {message: '当前项不能为空！',
                callback: function (value, validator) {
                    if (value == 0) {
                        return false
                    } else {
                        return true;
                    }
                }
            }
        }
    };
    const store_validator_options = Object.assign(Object.assign({},util.validatorOptions),{
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '店名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: '店名长度不能小于2位或超过30位'
                    },
                    regexp: {
                        regexp: /^[0-9A-Za-z\u4e00-\u9fa5]+$/,
                        message: '店名只能由字母、数字、汉字组成。'
                    },
                }
            },
            'input_province': callFn,
            'input_city': callFn,
            addr_detail: callFn,
            contact: util.validatorContact()
        }
    })
    // 添加门店
    const addStore = (address, seleted) =>{
        $('.store-table').hide();
        $('.store-form').show();
        $('.add-store').hide();
        $('.off-store').show();
        // 获取列表
        const html = `
            <div id="store-map" style="width:100%;height:300px;"></div>`;
        $('#map-warp').empty();
        $('#map-warp').append(html);
        // 设置样式
        util.toggleClass($('#select-store-id li'));
        // 创建表单验证
        $('.store-form').bootstrapValidator(store_validator_options)
        
    };
    // 关闭添加
    const closeAddModel = () =>{
        isEdit = false;
        //清除表单内容
        util.clearFormContent($('.store-form'));
        $('.store-form').data('bootstrapValidator').destroy();
        $('.store-form').data('bootstrapValidator', null); 
        $('.store-table').show();
        $('.store-form').hide();
        $('.add-store').show();
        $('.off-store').hide();
        // 清空已绑定的人员id
        selectEmId.clear();
        // 清空绑定角色列表
        $('#bind-em-roles ul').empty();
        $('#select-store-roles').selectpicker('refresh');
    };
    // $('.nav-store').on('click',showStore);
    $('.add-store').on('click',addStore);
    $('.off-store').on('click',closeAddModel);

    const creatHtmlLis = (time) =>{
        return `<li class="clearfix" style="margin: 5px;border: 1px solid #ccc;padding-left: 5px;line-height: 35px;border-radius: 5px;">
            <span style="display:inline-block;">${time}</span>
            <button type="button" style="margin-top:0px;" id="delet-store-time" class="btn btn-danger fr">
                <i class="iconfont icon-shanchu3"></i>
            </button>
        </li>`
    };

    //点击休店设置按钮 
    //添加时间
    const addTime = new Set();
    let rest_store_id = "";

    store.on('click','#store-rest-btn',function(){
        rest_store_id = $(this).attr('data-id');
        $('#myModal-company').modal('show');
        // 获取休店时间
        let htmlLis = '';
        ajax(Api('getRestDays', { storeid: rest_store_id})).then((res) => {
            if (res){

                const getDate = res.data.restDays;
                if (!Array.isArray(res.data) && getDate.length > 0){
                    for (let i = 0; i < getDate.length; i++) {
                        const date = getDate[i];
                        addTime.add(date);
                        htmlLis += creatHtmlLis(date);
                    }
                    $('#myModal-company-inner .em-list ul').append(htmlLis);
                }
            }
        });
        const datetimepickerInit = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        const initDate = util.fmtDate(datetimepickerInit);
        const html = `
            <div class="modal-body">
                <div class="clearfix">
                    <div class="fl wx-code tc">
                        <p>选择时间</p>
                        <div class=" clearfix">
                            <div class="input-group date fl" style="width:250px;">
                                <input id="datetimepicker" value="${initDate}" type="text" class="form-control" >

                            </div>
                            <button type="button"style="margin-top:0px;" id="add-store-time" class="btn btn-info fr">
                                <i class="iconfont icon-zengjia"></i>
                            </button>
                        </div>
                        
                    </div>
                    <div class="em-list fl tc">
                        <p>休店时间</p>
                        <ul></ul>
                    </div>
                </div>
                <div class="clearfix" style="margin-bottom:10px;">
                    <p style="width:50%;" class="tc fl">
                        <span style="color:red">提示：</span>
                        <em style="color: darkblue;">请选择该店休店时间！</em>
                    </p>
                    <div style="width:50%;" class="fr tc">
                        <button type="button" id="save-store-btn" class="btn btn-info">保&nbsp;&nbsp;&nbsp;&nbsp;存</button>
                    </div>
                    
                </div>
                
                
            </div>
        `; 
        util.addHtml($('#myModal-company-inner'), html);
        {/* <div id="check-time-store" class="clearfix" style="margin-top:10px;">
            <div id="check-date" class="fl on" style="width:75px;"><i class="iconfont icon-yixuanze"></i>&nbsp;&nbsp;&nbsp;&nbsp;全天</div>
            <div id="check-date-am" class="fl" style="width:75px;"><i class="iconfont icon-weixuanze"></i>&nbsp;&nbsp;&nbsp;&nbsp;上午</div>
            <div id="check-date-pm" class="fl" style="width:75px;"><i class="iconfont icon-weixuanze"></i>&nbsp;&nbsp;&nbsp;&nbsp;下午</div>
        </div> */}
        $('#datetimepicker').datetimepicker({
            language: "zh-CN",    //语言选择中文
            format: "yyyy-mm-dd", 
            timepicker: true,
            autoclose: true,
            startView: 2,
            minView: 2, 
            startDate: datetimepickerInit,
        });
        
        $('#add-store-time').on('click',function(){
            const time = $('#datetimepicker').val();
            console.log(time);
            // 查询该时间是否已经被添加！
            if(addTime.has(time)){
                util.myLayer(`该时间已添加！`, 2)
                return false;
            }
            addTime.add(time);
            const html = creatHtmlLis(time);
            $('#myModal-company-inner .em-list ul').append(html);
        });
    });
    // 绑定删除元素事件
    $('#myModal-company-inner').on('click', '#delet-store-time', function () {
        const inner = $(this).siblings().text();
        addTime.delete(inner);
        $(this).parent().remove();
    })
    // 保存休店时间
    $('#myModal-company').on('click', '#save-store-btn',function(){
        const restDays = Array.from(addTime)
        console.log(restDays);
        const obj = {
            storeid: rest_store_id
        }
        obj.restDays = restDays;
        if (restDays.length > 0){
            ajax(Api('setRestDays', obj)).then((res)=>{
                // 关闭模态框
                if(res){
                    util.myLayer('保存成功！',1);
                    $('#myModal-company').modal('hide');
                }
            })
        } else {
            util.myLayer('请选择休店日期！');
        }
    });
    $('#myModal-company').on('hidden.bs.modal',function(){
        rest_store_id = '';
        addTime.clear();
    })
    // 获取二维码
    store.on('click', '#store-code-btn', function () {
        // 先清空员工列表id
        emlistId.clear();
        $('#myModal-company').modal('show');
        // 获取当前店的二维码
        const qrcode = $(this).attr('data-id');
        const html = `
            <div class="modal-body">
                <div class="clearfix">
                    <div class="fl wx-code tc">
                        <p class="tc">二维码<p>
                        <img class="" src="${qrcode}" title="二维码">
                        <a href="${qrcode}" download="下载二维码" class="btn btn-info active" role="button">下载保存</a>
                    </div>
                    <div class="em-list fl">
                    </div>
                </div>
                <p class="tc">
                    <span style="color:red">提示：</span>
                    <em style="color: darkblue;">可以选择员工发送二维码，也可下载到本地！</em>
                </p>
            </div>
        `;
        util.addHtml($('#myModal-company-inner'), html);

        // 获取二维码
        ajax(Api('getEmpList')).then((res) => {
            const data_list = res.data;
            if (data_list) {
                let html = `<p class="tc">员工列表<p><ul>`;
                for (let i = 0; i < data_list.length; i++) {
                    const lis = data_list[i];
                    html += `<li  class="list-group-item em-lis fz16" data-id="${lis.id}">${lis.name}</li>`
                }
                html += `</ul>
                <button type="button" class="fr btn btn-info send-em-code on">确定发送</button>
                `;
                util.addHtml($('#myModal-company .modal-body .em-list'), html);
                // 绑定事件
                $('#myModal-company-inner').on('click','.em-lis',function(){
                    $(this).toggleClass('active');
                    const id = $(this).attr('data-id')
                    emlistId.has(id) ? emlistId.delete(id) : emlistId.add(id)
                    console.log(emlistId)
                })
            }else{
                util.myLayer('获取员工列表出错！',5)
            }
        });

    });
    // 禁用门店
    store.on('click', '#store-delet-btn', function () {
        const data = { 'storeid': $(this).attr('data-id') };
        util.deletList('storeBlock', getStoreList_fn, data, listArr);
    });
    // 编辑门店
    store.on('click', '#store-edit-btn', function () {
        isEdit = true;
        currentStoreId = $(this).parent().children("input").val();
        // 获取点击元素的信息
        let getData = {};
        for (let i = 0; i < storeLists.length; i++) {
            const item = storeLists[i];
            if (currentStoreId == item.id) {
                getData = Object.assign({}, item);
                break
            }
        }
        let select = '';
        try {
            select = (getData.operator_ids).map((item) =>{
                return item.id;
            })
        } catch (error) {
            console.log(error);
        } 
        
        // 获取单个门店信息
        ajax(Api('getStore', { storeid: currentStoreId})).then((res) =>{
            const data = res.data;
            if (data.typeRoles.length > 0) {
                const roles = data.typeRoles;
                for (let i = 0; i < roles.length; i++) {
                    const item = roles[i];
                    selectEmId.add(item.empId.id);
                    let html = '';
                    html += util.creatHtml1('员工', item.empId);
                    for (let j = 0; j < listArr[0].length; j++) {
                        const ele = listArr[0][j];
                        let a = true;
                        if (item.rolesId) {
                            for (let k = 0; k < item.rolesId.length; k++) {
                                const rolesEle = item.rolesId[k];
                                if (rolesEle.id == ele.id) {
                                    a = false;
                                    html += util.creatHtmlSpan(rolesEle, true, 'checked', 'icon-yixuanze');
                                    break;
                                }
                            }
                        }
                        if (a) {
                            html += util.creatHtmlSpan(ele, true);
                        }
                    }
                    // 修改头部样式
                    util.restClassName($('#select-store-id li'), item.empId.id)
                    html += util.creatHtmlBtn(item.empId.id, 'delet-store-soles-list');
                    $('#bind-em-roles ul').append(html);
                }
            }
        })
        // 将员工信息赋值给input
        const form = $('.store-form');
        form.find('input[name="name"]').val(getData.name);
        form.find('input[name="contact"]').val(getData.contact);
        // $('#select-store-id').selectpicker('val', select);
        form.find("#input_province").val(getData.input_province);
        $("#input_province").trigger('change')
        form.find("#input_city").val(getData.input_city);
        $("#input_city").trigger('change')
        form.find("#input_area").val(getData.input_area);
        form.find('input[name="addr_detail"]').val(getData.addr_detail);
        addStore(getData, select);
        
    });
    const submit_store_add = () => {
        $('.store-form').bootstrapValidator('validate');//提交验证  
        if ($('.store-form').data('bootstrapValidator').isValid()){
            const getData = $('.store-form').serializeArray(),
                arr = [];
            let  obj = {},
                api = 'addStore';
            for (let i = 0; i < getData.length; i++) {
                const item = getData[i];
                if (item.name === "select-store-all"){
                    arr.push(item.value)
                }else{
                    obj[item.name] = item.value
                }
            }
            obj.operator_ids = arr;
            let msg = '添加成功！';
            if (isEdit){
                // 更新门店
                obj.storeid = currentStoreId;
                api = 'gudateStore';
                msg = '编辑成功！'
            }
            // 获取绑定员工的id值
            const a = util.getSelectedValue('#bind-em-roles ul li','empId');
            obj = Object.assign(obj, { typeRoles: a });
            ajax(Api(api,obj)).then((res) =>{
                if(res){
                    util.myLayer(msg,1);
                    closeAddModel();
                    getStoreList_fn(listArr);
                }else{
                    util.myLayer('请求失败！', 5);
                }
            })
        }
    };
    // 提交新增门店地址
    $('.store-btn-add').click(submit_store_add)
})

