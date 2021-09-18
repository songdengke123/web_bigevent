$(function() {
    //点击去注册的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    });
    //点击去登陆页面的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });

    //从layui获取对象
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        //校验两次密码是否一致
        repwd: function(value) {
            //通过形参拿到的是确认密码框的内容
            //还需要拿到密码框的内容
            //进行判断、判断失败返回出去
            var pwd = $('.reg-box [name=repassword]').val()
            if (value !== pwd) return '两次密码不一致'
        }
    })

    //监听注册表单提交时间
    $('#form_reg').on('submit', function(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发起post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            //模拟人的点击行为
            $('#link_login').click();

        })
    })

    //监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'post',
            //快速获取表单的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                //将登录成功后得到token字符串保存起来
                localStorage.setItem('token', res.token)
                    //跳转后台首页
                location.href = '/index.html'
            }
        })
    })
})