$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }
    //为添加类别添加点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    //通过事件委托为form-add绑定点击事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功');
                //根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    });
    var indexEdit = null
        //通过代理的形式为编辑按钮绑定事件
    $('tbody').on('click', '.btn-edit', function() {
        //弹出一个修改文章的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-Id')
            //发请求获取对应的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    });
    // 通过代理为编辑修改表单绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败')
                }
                layer.msg('修改分类成功');
                //根据索引关闭弹出层
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });
    //通过代理的方式为删除按钮添加事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        //提示用户是否删除
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList();
                }
            })


        });
    })

})