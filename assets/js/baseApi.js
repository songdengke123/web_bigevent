//每次调用ajax都会先调用这个函数
//在这个函数中可以拿到给ajax提供的对象
$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前统一拼接请求的根据经
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 同意为有权限的接口设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局容易挂债complete回调函数
    //不论成功还是失败都会调用这个函数
    options.complete = function(res) {
        //在回调中可以使用responseJSON拿到服务器响应的数据
        if (res.responseJSON.status === 1) {
            //强制清空token
            localStorage.removeItem('token');
            //强制跳转登录页
            location.href = '/login.html';
        }
    }

})