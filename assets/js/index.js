$(function() {
    //调用函数获取基本信息
    getUserInfo();

    //点击按钮实现退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        //弹出提示框提示用户是否确认退出
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清空本地存储中的内容
            localStorage.removeItem('token');
            //跳转到登录页
            location.href = '/login.html';
            //关闭询问框
            layer.close(index);
        });
    })
})

//获取基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调入函数渲染头像
            renderAvatar(res.data)
        }
    })
}
//渲染用户头像函数
function renderAvatar(user) {
    //获取昵称
    var name = user.nickname || user.username;
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', use.user_pic).show();
        $('.text-avatar').hide();

    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}