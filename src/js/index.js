// "use strict"
(function a(){
    const lis = $(".nav-list");
    for (let i = 0; i < lis.length; i++) {
        $(lis[i]).mouseenter(function () {
            $(this).addClass('active').siblings().removeClass('active')
        });
        $(lis[i]).click(function() {
            console.log(i)
        })
    }
})();
const a = (()=>{
    console.log(321)
})()