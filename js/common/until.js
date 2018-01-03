/**
 * 转换金额
 * @param num [float] 待转换金额
 */
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if(cents < 10)
		cents = "0" + cents;
	for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return(((sign) ? '' : '-') + num + '.' + cents);
}

/**
 * 从json列表中获取实体
 * @author dfq 2016-06-07
 */
function getModel(data, key, value) {
	var json = {};
	$.each(data, function(i, item) {
		if(item[key] == value) {
			json = item;
		}
	});
	return json;
}

/**
 * 两个浮点数求和
 * @param {Object} num1
 * @param {Object} num2
 */
function accAdd(num1, num2) {
	var r1, r2, m;
	try {
		r1 = num1.toString().split('.')[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = num2.toString().split('.')[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return Math.round(num1 * m + num2 * m) / m;
}

/**
 * 两个浮点数相减
 * @param {Object} num1
 * @param {Object} num2
 * @param {Object} digits
 */
function accSub(num1, num2, digits) {
	var r1, r2, m;
	try {
		r1 = num1.toString().split('.')[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = num2.toString().split('.')[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	if(n > 15) {
		n = 15;
	}

	if(arguments.length >= 3) {
		n = digits;
	}

	return(Math.round(num1 * m - num2 * m) / m).toFixed(n);
}

/**
 * 两个浮点数两数相除
 * @param {Object} num1
 * @param {Object} num2
 */
function accDiv(num1, num2) {
	var t1, t2, r1, r2;
	try {
		t1 = num1.toString().split('.')[1].length;
	} catch(e) {
		t1 = 0;
	}
	try {
		t2 = num2.toString().split('.')[1].length;
	} catch(e) {
		t2 = 0;
	}
	r1 = Number(num1.toString().replace(".", ""));
	r2 = Number(num2.toString().replace(".", ""));
	return(r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 两个浮点数两数乘
 * @param {Object} num1
 * @param {Object} num2
 */
function accMul(num1, num2) {
	var m = 0,
		s1 = num1.toString(),
		s2 = num2.toString();
	try {
		m += s1.split('.')[1].length
	} catch(e) {};
	try {
		m += s2.split('.')[1].length
	} catch(e) {};
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 多个浮点数两数乘
 */
function accMuls() {
	var result = 0;
	if(arguments.length > 0) {
		result = 1;
		for(var i = 0; i < arguments.length; i++) {
			result = accMul(arguments[i],result);
		}
	}
	return result;
}