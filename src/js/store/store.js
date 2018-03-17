"use strict"
import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'
import '../../css/index.less'


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
    let selectEmId = new Set();//当前门店id
    const getStoreList_fn = () =>{
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
                            <td>
                        `;
                        if (tr.operator_ids){
                            const a = tr.operator_ids;
                            for (let j = 0; j < a.length; j++) {
                                const el = a[j];
                                html += '<p>' + el.name +'</p>'
                            }
                        }
                        html += `</td>
                            <td>${tr.contact} </td>
                            <td>${tr.input_province}${tr.input_city}${tr.input_area}${tr.addr_detail}</td>
                            <td> 
                                <button data-id="${tr.qrcode}" class="btn btn-primary" id="store-code-btn">获取</button>
                            </td>
                            <td> 
                                <button data-id="${tr.id}" class="btn btn-primary" id="store-rest-btn">设置</button>
                            </td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="store-edit-btn">编辑</button>
                                <button class="btn btn-danger" id="store-delet-btn">删除</button>
                            </td>
                        </tr>
                        `;
                    }
                    html += `</tbody>`;
                } else {
                    html = `<p>暂无数据！</p>`
                }
                const eleList = $('.store-table');
                eleList.empty();
                eleList.append(html);
            }
        });
    }
    // const showStore = () =>{
        // 获取门店列表
        getStoreList_fn()
    // };

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
            // 'select-store-all': {
            //     validators: {
            //         notEmpty: {
            //             message: '当前项不能为空！'
            //         },
            //         callback: {
            //             callback: function (value, validator) {
            //                 if (value == 0) {
            //                     return false
            //                 } else {
            //                     return true;
            //                 }
            //             }
            //         }
            //     }
            // },
            'input_province': callFn,
            'input_city': callFn,
            addr_detail: callFn,
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
            }
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
        $('#map-warp').append(html);270002
        // 创建表单验证
        $('.store-form').bootstrapValidator(store_validator_options)
        // if (seleted) {
        //     creatMap(address);
        // } else{
        //     creatMap();
        // }

        const obj_options_select = {
            url1:'getRoles',
            url2:'getEmpList',
            store:'#select-store-id',
            roles:'#select-store-roles',
            add_list:'#add-store-soles-2',
            dele_list:'delet-store-soles-list',
            warpul:'#bind-em-roles ul',
            warp:'#bind-em-roles',
            text:'员工'
        }
        util.getSelectList(obj_options_select, selectEmId);
        
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
    };
    // $('.nav-store').on('click',showStore);
    $('.add-store').on('click',addStore);
    $('.off-store').on('click',closeAddModel);
    //点击休店设置按钮 
    store.on('click','#store-rest-btn',function(){
        $('#myModal-company').modal('show');
        const html = `
            <div class="modal-body">
                <div class="clearfix">
                    <div class="fl wx-code tc">
                        选择时间
                        <div class="input-group date">
                            <input id="datetimepicker" type="text" class="form-control" >
                        </div>
                    </div>
                    <div class="em-list fl">
                    </div>
                </div>
                <p class="tc">
                    <span style="color:red">提示：</span>
                    <em style="color: darkblue;">请现在该店休店时间！</em>
                </p>
            </div>
        `;
        $('#myModal-company-inner').empty();
        $('#myModal-company-inner').append(html);
        
        $('#datetimepicker').datetimepicker({
            language: "zh-CN",    //语言选择中文
            format: "yyyy-mm-dd", 
            timepicker: true,
            autoclose: false,
            startView: 2,
            minView: 2, 
            todayBtn:true,
        });
        // $('#datetimepicker').datepicker('destroy');
    });
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
        $('#myModal-company-inner').empty();
        $('#myModal-company-inner').append(html);

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
                $('#myModal-company .modal-body .em-list').empty();
                $('#myModal-company .modal-body .em-list').append(html);
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
    // 删除门店
    store.on('click', '#store-delet-btn', function () {
        deletList('deletStore', getStoreList_fn);
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
        const select = (getData.operator_ids).map((item) =>{
            return item.id;
        })
        // 获取单个门店信息
        ajax(Api('getStore', { storeid: currentStoreId})).then((res) =>{
            
        })
        // 将员工信息赋值给input
        const form = $('.store-form');
        form.find('input[name="name"]').val(getData.name);
        form.find('input[name="contact"]').val(getData.contact);
        // $('#select-store-id').selectpicker('val', select);
        form.find('input[name="input_province"]').val(getData.input_province);
        form.find('input[name="input_city"]').val(getData.input_city);
        form.find('input[name="input_area"]').val(getData.input_area);
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
            if (isEdit){
                // 更新门店
                obj.storeid = currentStoreId;
                api = 'gudateStore';
            }
            // 获取绑定员工的id值
            const a = util.getSelectedValue('#bind-em-roles ul li');
            obj = Object.assign(obj, { typeRoles: a });
            ajax(Api(api,obj)).then((res) =>{
                if(res){
                    util.myLayer('添加成功！',1);
                    closeAddModel();
                    getStoreList_fn();
                }
            })
        }
    };
    // 提交新增门店地址
    $('.store-btn-add').click(submit_store_add)
})

