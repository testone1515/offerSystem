var edit = new Vue({
	el: '#vue-edit',
	data: {
		paramModel: {
			name: '', //图号/名称
			materialUnitPrice: 0, //材料单价,
			materialDensity: 0, //材料密度
			materialThickness: 0, //材料厚度
			materialLength: '', //材料长
			materialWidth: '', //材料宽
			materialPrice: '', //材料价格
			boreNumber: '', //穿孔数量
			cutLength: '', //切割长度
			boreUnitPrice: 0, //穿孔单价
			cutUnitPrice: 0, //切割单价
			laserPrice: 0, //激光价格
			bend: '', //折弯
			weld: '', //焊接
			machining: '', //机加工
			enlargeOr3: '', //阔孔/压铆/攻牙
			surfaceType: '', //表面处理类型
			surfaceUnitPrice: '', //表面处理单价
			packUnitPrice: '', //包装价格
			logisticsCompany: '', //物流公司
			freight: '', //运费
			bend: '', //折弯

		},
		name: "",
		textureList: [],
		thicknessList: [],
		surfaceList: [],
		packList: []
	},
	watch: {//观察者
		paramModel: function(val) {
			getmaterialPrice(edit.paramModel);
		}
		
	}
});

layui.use(['layer', 'form', 'fsDatagrid', 'element'], function() {
	var layer = layui.layer;
	var form = layui.form;
	var element = layui.element;

	//点击事件
	$(document).on('click', '#add', function() {
		layer.open({
			type: 1,
			title: "添加材料",
			area: '1200px',
			content: $('#edit')
		});
	});

	//监听下拉框材质
	form.on('select(texture)', function(data) {
		var model = getModel(edit.textureList, "id", data.value);
		edit.paramModel.materialUnitPrice = model.unitPrice;
		edit.paramModel.materialDensity = model.density;
	});

	//监听下拉框材料厚度
	form.on('select(thickness)', function(data) {
		edit.paramModel.materialThickness = data.value;
	});

	//监听下拉框包装材料
	form.on('select(pack)', function(data) {
		edit.paramModel.pack = data.value;
	});

	//监听下拉框表面处理
	form.on('select(surface)', function(data) {
		edit.paramModel.surfaceType = data.value;
	});

	//初始化下拉列表
	$.when($.getJSON("/js/config/data.json")).then(function(req) {
		edit.textureList = req.texture;
		edit.thicknessList = req.thickness;
		edit.surfaceList = req.surface;
		edit.packList = req.pack;
		edit.paramModel.materialUnitPrice = req.texture[0].unitPrice;
		edit.paramModel.materialThickness = req.thickness[0];
		edit.paramModel.surfaceType = req.surface[0].type;
		edit.paramModel.pack = req.pack[0];
	}).then(function() {
		form.render('select');
	});

});

/**
 * 计算材料价格
 * @param {Object} model
 */
function getmaterialPrice(model) {
	var result = 0;
	//“厚度”X“长”X“宽”X“密度”X 1.1 X“单价”÷1000000
	var materialThickness = model.materialThickness - 0.0;
	var materialLength = model.materialLength - 0.0;
	var materialWidth = model.materialWidth - 0.0;
	var materialDensity = model.materialDensity - 0.0;
	var materialUnitPrice = model.materialUnitPrice - 0.0;
	result = accMuls(materialThickness, materialLength, materialWidth, materialDensity, 1.1, materialUnitPrice);
	console.log(result);
	result = accDiv(result, 1000000);
	console.log(result);
	return result;
}