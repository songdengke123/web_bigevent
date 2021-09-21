$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数对象需要将参数对象提交到服务器
    var q = {
        pagenum: '1', //默认请求第一页的数据
        pagesize: '2', //默认每页显示多少数据
        cate_id: '', //文章分类的id
        state: '' //文章发布的状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                //调用米板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    //为筛选表单绑定事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单中选择的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件重新渲染表格数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示多少条
            curr: q.pagenum, //指定默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候发生回调
            //触发jumo方式：
            //1点击页码的时候会触发
            //2只要调用了laypage.render方法就会触发jump回调
            jump: function(obj, first) {

                //把最新的页码值赋值到q查询参数对象中
                q.pagenum = obj.curr

                //把最新的条目数复制到q这个查询对象上
                q.pagesize = obj.limit

                //根据最新的q获取对应的数据列表、并渲染表格
                // 可以通过first的值判断那种方式触发的jump回调
                //如果true证明事第二种  否则是第二种
                if (!first) {
                    initTable()
                }

            }
        });
    }

    //通过代理的方式为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
            //询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    //当数据删除完成后需要判断这页中、是否还有剩余的数据
                    //如果没有数据就让页码值减一在调用initTable方法
                    if (len === 1) {
                        //如果值等于一、证明删除之后就没有数据了

                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})