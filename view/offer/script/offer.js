var edit = new Vue({
	el: '#vue-edit',
	data: {
		paramModel: {
			name: '', //图号/名称
			textureId: "", //材料编号
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
			bend: '' //折弯
		},
		textureList: [],
		thicknessList: [],
		surfaceList: [],
		packList: []
	},
	/**
	 * 属性计算
	 */
	computed: {
		/**
		 * 计算材料价格
		 */
		materialPrice: function() {
			return getmaterialPrice(this.paramModel);
		},
		/**
		 * 计算穿孔价格
		 */
		boreUnitPrice: function() {
			var value = getBoreUnitPrice(this.paramModel);
			this.paramModel.boreUnitPrice = value;
			return value;
		},
		/**
		 * 计算切割价格
		 */
		cutUnitPrice: function() {
			var value = getCutUnitPrice(this.paramModel);
			this.paramModel.cutUnitPrice = value;
			return value;
		},
		/**
		 * 计算激光价格
		 */
		laserPrice:function(){
			var value = getLaserPrice(this.paramModel);
			this.paramModel.laserPrice = value;
			return value;
		}
	}
});

var textureThickUnitPrice = []; //单价

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
		edit.paramModel.textureId = data.value;
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
		edit.paramModel.textureId = req.texture[0].id;
		edit.paramModel.materialUnitPrice = req.texture[0].unitPrice;
		edit.paramModel.materialDensity = req.texture[0].density;
		edit.paramModel.materialThickness = req.thickness[0];
		edit.paramModel.surfaceType = req.surface[0].type;
		edit.paramModel.pack = req.pack[0];
		textureThickUnitPrice = req.textureThickUnitPrice;

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
	result = accDiv(result, 1000000);
	result = result - 0.0;
	result = result.toFixed(2);
	return result;
}

/**
 * 获取穿孔和切割单价实体
 * @param {Object} model
 */
function GetTextureThickUnitPriceModel(model) {
	var id = model.textureId;
	var materialThickness = model.materialThickness - 0.0;
	var json;
	$.each(textureThickUnitPrice, function(i, item) {
		if(item.textureId == id && item.thickness) {
			json = item;
		}
	});
	return json;
}

/**
 * 获取穿孔单价
 * @param {Object} model
 */
function getBoreUnitPrice(model) {
	var json = GetTextureThickUnitPriceModel(model);
	var result = 0;
	if(json) {
		result = json.boreUnitPrice;
	}
	console.log(result);
	return result;
}

/**
 * 获取切割单价
 * @param {Object} model
 */
function getCutUnitPrice(model) {
	var json = GetTextureThickUnitPriceModel(model);
	var result = 0;
	if(json) {
		result = json.cutUnitPrice;
	}
	console.log(result);
	return result;
}

/**
 * 获取激光价格
 * @param {Object} model
 */
function getLaserPrice(model) {
	var boreNumber = model.boreNumber - 0.0; //穿孔数量
	var cutLength = model.cutLength - 0.0; //切割长度
	var boreUnitPrice = model.boreUnitPrice - 0.0; //穿孔单价
	var cutUnitPrice = model.cutUnitPrice - 0.0; //切割单价
	var boreresult = accMul(boreNumber, cutUnitPrice);
	var cutresult = accMul(cutLength, cutUnitPrice);
	var result = accAdd(boreresult, cutresult);
	result = result - 0.0;
	result = result.toFixed(2);
	result = result - 0.0;
	return result;
	//“穿孔数量”X“穿孔单价”+“切割单价”X“切割数量”
}