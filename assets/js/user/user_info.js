$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须1-6个字符之间'
            }
        }
    });

    initUserInfo();

    function initUserInfo() {
        //初始化用户信息
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！');
                }
                //调用form.val为表单快速赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    //重置表单的数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });
    //监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                console.log('更新用户信息成功！');
                //调用父页面中的方法渲染用户的头像和名字
                window.parent.getUserInfo();
            }
        })
    })
})