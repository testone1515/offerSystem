var layer = null;

var vueTable = new Vue({
	el: '#lay-table',
	data: {
		list: []
	},
	methods: {
		addRow: function(param) {
			var model = {
				id: $.uuid(),
				date: moment().format('LL'),
				name: param.name,
				collectUnitPrice: param.collectUnitPrice,
				numbers: param.numbers,
				subtotal: param.subtotal,
				weight: param.weight,
				taxPrice: param.taxPrice,
				salePrice: param.salePrice,
				user: param.user,
				remark: param.remark
			};
			this.list.push(model);
			layer.msg('添加成功！', {
				icon: 6
			});
		}
	}

});

layui.use(['layer', 'form', 'element'], function() {
	layer = layui.layer;
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
			content: '/offer/edit.html'
		});
	});

	//打印点击事件
	$(document).on('click', '#printer', function() {
		$("#print-area").print({
			globalStyles: true,
        	mediaPrint: false,
        	stylesheet: null,
        	noPrintSelector: ".no-print",
        	iframe: true,
        	append: null,
        	prepend: null,
        	manuallyCopyFormValues: true,
        	deferred: $.Deferred(),
        	timeout: 750,
        	title: null,
        	doctype: '<!doctype html>'
		});
	});
});