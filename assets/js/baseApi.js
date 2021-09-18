//每次调用ajax都会先调用这个函数
//在这个函数中可以拿到给ajax提供的对象
$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前统一拼接请求的根据经
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})