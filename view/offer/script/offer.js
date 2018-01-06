layui.use(['layer', 'form', 'fsDatagrid', 'element'], function() {
	var layer = layui.layer;
	var form = layui.form;
	var element = layui.element;

	//点击事件
	$(document).on('click', '#add', function() {
		top.layer.open({
			type: 2,
			maxmin: true,
			title: "添加材料",
			area: ['1200px', '630px'],
			zIndex: layer.zIndex, //重点1
			content: '/view/offer/edit.html',
			success: function(layero) {
				layer.setTop(layero); //重点2
			}
		});
	});
});
