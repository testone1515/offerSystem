var textureThickUnitPrice = []; //单价
var index = 0;
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
			borenumbers: '', //穿孔数量
			cutLength: '', //切割长度
			boreUnitPrice: 0, //穿孔单价
			cutUnitPrice: 0, //切割单价
			laserPrice: 0, //激光价格
			bend: '', //折弯
			weld: '', //焊接
			machining: '', //机加工
			enlargeOr3: '', //阔孔/压铆/攻牙
			surfaceId: '', //表面编号
			surfacePrice: '', //表面处理价格
			packUnitPrice: '', //包装价格
			logisticsCompany: '', //物流公司
			freight: '', //运费
			bend: '', //折弯
			collectUnitPrice: 0, //汇总单价
			weight: 0, //重量
			numbersss: '', //数量
			user: '', //申报人
			taxPrice: 0, //含税价
			subtotal: 0, //小计
			salePrice: 0, //销售价
			remark: "" //备注
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
			//console.log("materialPrice");
			var value = getmaterialPrice(this.paramModel);
			this.paramModel.materialPrice = value;
			return value;
		},
		/**
		 * 计算穿孔价格
		 */
		boreUnitPrice: function() {
			//console.log("boreUnitPrice");
			var value = getBoreUnitPrice(this.paramModel);
			this.paramModel.boreUnitPrice = value;
			return value;
		},
		/**
		 * 计算切割价格
		 */
		cutUnitPrice: function() {
			//console.log("cutUnitPrice");
			var value = getCutUnitPrice(this.paramModel);
			this.paramModel.cutUnitPrice = value;
			return value;
		},
		/**
		 * 计算激光价格
		 */
		laserPrice: function() {
			//console.log("laserPrice");
			var value = getLaserPrice(this.paramModel);
			this.paramModel.laserPrice = value;
			return value;
		},
		/**
		 * 计算汇总单价
		 */
		collectUnitPrice: function() {
			var value = getCollectUnitPrice(this.paramModel);
			this.paramModel.collectUnitPrice = value;
			return value;
		},
		/**
		 * 计算小计
		 */
		subtotal: function() {
			var value = getSubtotal(this.paramModel);
			this.paramModel.subtotal = value;
			return value;
		},
		/**
		 * 计算重量
		 */
		weight: function() {
			var value = getWeight(this.paramModel);
			this.paramModel.weight = value;
			return value;
		},
		/**
		 * 计算表面处理单价
		 */
		surfacePrice: function() {
			var json = getSurface0Price(this.paramModel);
			this.paramModel.surfacePrice = json.result;
			return json.result;
		}
	},
	watch: {　
		paramModel: {　　　　
			handler(newValue, oldValue) {　
				//console.log(index);
				if(index > 0) {
					localStorage.setItem("paramModel", JSON.stringify(newValue));　
					if(index > 999999) {
						index = 1;
					}
				}
				index++;
			},
			deep: true
		}
	}
});

layui.use(['layer', 'form', 'element'], function() {
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
		//console.log("监听下拉框材质");
		var model = getModel(edit.textureList, "id", data.value);
		edit.paramModel.textureId = data.value;
		edit.paramModel.materialUnitPrice = model.unitPrice;
		edit.paramModel.materialDensity = model.density;
	});

	//监听下拉框材料厚度
	form.on('select(thickness)', function(data) {
		//console.log("监听下拉框材料厚度");
		edit.paramModel.materialThickness = data.value;
	});

	//监听下拉框包装材料
	form.on('select(pack)', function(data) {
		//console.log("监听下拉框包装材料");
		edit.paramModel.pack = data.value;
	});

	//监听下拉框表面处理
	form.on('select(surface)', function(data) {
		//console.log("监听下拉框表面处理");
		edit.paramModel.surfaceId = data.value;
	});

	form.on('submit(save)', function(data) {
		console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
		console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
		console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});

	//初始化下拉列表
	$.when($.getJSON("/js/config/data.json")).then(function(req) {
		edit.textureList = req.texture;
		edit.thicknessList = req.thickness;
		edit.surfaceList = req.surface;
		edit.packList = req.pack;
		textureThickUnitPrice = req.textureThickUnitPrice;
		var item = localStorage.getItem("paramModel");
		if(item) {
			//console.log("初始化下拉列表");
			setTimeout(function() {
				edit.paramModel = JSON.parse(item);
				initCaculate();
			}, 1500);

		} else {
			edit.paramModel.textureId = req.texture[0].id;
			edit.paramModel.materialUnitPrice = req.texture[0].unitPrice;
			edit.paramModel.materialDensity = req.texture[0].density;
			edit.paramModel.materialThickness = req.thickness[0];
			edit.paramModel.surfaceType = req.surface[0].type;
			edit.paramModel.pack = req.pack[0];
			initCaculate();
		}

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
		if(item.textureId == id && item.thickness == materialThickness) {
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
	//console.log(result);
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
	//console.log(result);
	return result;
}

/**
 * 获取激光价格
 * @param {Object} model
 */
function getLaserPrice(model) {
	//“穿孔数量”X“穿孔单价”+“切割单价”X“切割数量”
	var borenumbers = model.borenumbers - 0.0; //穿孔数量
	var cutLength = model.cutLength - 0.0; //切割长度
	var boreUnitPrice = model.boreUnitPrice - 0.0; //穿孔单价
	var cutUnitPrice = model.cutUnitPrice - 0.0; //切割单价
	var boreresult = accMul(borenumbers, cutUnitPrice);
	var cutresult = accMul(cutLength, cutUnitPrice);
	var result = accAdd(boreresult, cutresult);
	result = result - 0.0;
	result = result.toFixed(2);
	result = result - 0.0;
	return result;
}

/**
 * 获取汇总单价
 * @param {Object} model
 */
function getCollectUnitPrice(model) {
	//“材料价格”+“激光价格”+“折弯”+“焊接”+“阔孔/压铆/攻牙”+“机加工”+“表面处理”+“包装价格”+“运费”
	var materialPrice = model.materialPrice - 0.0;
	var laserPrice = model.laserPrice - 0.0;
	var bend = model.bend - 0.0;
	var weld = model.weld - 0.0;
	var enlargeOr3 = model.enlargeOr3 - 0.0;
	var machining = model.machining - 0.0;
	var surfaceUnitPrice = model.surfaceUnitPrice - 0.0;
	var packUnitPrice = model.packUnitPrice - 0.0;
	var freight = model.freight - 0.0;
	var result = accAdds(materialPrice, laserPrice, bend, weld, enlargeOr3, machining, surfaceUnitPrice, packUnitPrice, freight);
	result = result - 0.0;
	result = result.toFixed(2);
	result = result - 0.0;
	return result;
}

/**
 * 获取小计
 * @param {Object} model
 */
function getSubtotal(model) {
	var collectUnitPrice = model.collectUnitPrice - 0.0;
	var numbers = model.numbers - 0.0;
	var result = accMul(collectUnitPrice, numbers);
	result = result - 0.0;
	result = result.toFixed(2);
	result = result - 0.0;
	return result;
}

/**
 * 获取重量
 * @param {Object} model
 */
function getWeight(model) {
	//“厚度”X“长”X“宽”X“密度”X 1.1 ÷1000000
	var materialThickness = model.materialThickness - 0.0; //材料厚度
	var materialLength = model.materialLength - 0.0; //长
	var materialWidth = model.materialWidth - 0.0; //宽
	var materialDensity = model.materialDensity - 0.0; //密度
	var result = accMuls(materialThickness, materialLength, materialWidth, materialDensity, materialDensity);
	result = accDiv(result, 1000000);
	result = result - 0.0;
	result = result.toFixed(2);
	result = result - 0.0;
	return result;
}

/**
 * 获取表面处理价格
 * @param {Object} model
 */
function getSurface0Price(model) {
	var surfaceId = $.trim(model.surfaceId + "");
	var materialLength = model.materialLength - 0.0; //长
	var materialWidth = model.materialWidth - 0.0; //宽
	var result = 0;
	var type = 1;
	if(edit) {
		var surface = getModel(edit.surfaceList, "id", surfaceId);
		if(surface) {
			if(surface.type == 0) {
				type = 0;
				//“长”X“宽”X 2 ÷1000000X“喷塑单价”
				var result = accMuls(materialLength, materialWidth, 2, surface.unitPrice);
				result = accDiv(result, 1000000);
				result = result - 0.0;
				result = result.toFixed(2);
				result = result - 0.0;
			}
		}
	}

	return {
		type: type,
		result: result
	};
}

/**
 * 初始化计算结果
 */
function initCaculate() {
	edit.paramModel.boreUnitPrice = getBoreUnitPrice(edit.paramModel);
	edit.paramModel.cutUnitPrice = getCutUnitPrice(edit.paramModel);
	edit.paramModel.laserPrice = getLaserPrice(edit.paramModel);
	edit.boreUnitPrice = edit.paramModel.boreUnitPrice;
	edit.cutUnitPrice = edit.paramModel.cutUnitPrice;
	edit.laserPrice = edit.paramModel.laserPrice;
	var json = getSurface0Price(edit.paramModel);
	if(json.type == 0) {
		edit.paramModel.surfacePrice = json.result;
	}
}