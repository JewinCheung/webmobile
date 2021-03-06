'use strict'

/**
 * 字符串替换过滤器
 * data 字符串
 * src 要替换的字符
 * dest 最终要换的字符
 */
exports.replace = (data, src, dest) => {
	var reg = new RegExp(src, "g");
	var tempStr = data || "";
	return tempStr.replace(reg, dest);
}


/**
 * 字符串替换过滤器
 * data 字符串
 * length 截取的字符串长度 
 */
exports.substr = (data, length, isAdd) => {
	if (data && data.length > 0) {
		var result = data.substring(0, length);
		if (isAdd && data.length > length) {
			result += "..";
		}
		return result;
	}
	return "";
}

exports.substrNew = (data, length) => {
	if (data.replace(/[\u4e00-\u9fa5]/g, "**").length <= length) {
		return data;
	}
	else {
		var len = 0;
		var tmpStr = "";
		for (var i = 0; i < data.length; i++) {//遍历字符串  
			if (/[\u4e00-\u9fa5]/.test(data[i])) {//中文 长度为两字节  
				len += 2;
			}
			else {
				len += 1;
			}
			if (len > length) {
				break;
			}
			else {
				tmpStr += data[i];
			}
		}
		return tmpStr + " ..";
	}
}

/**
 * 字符串添加颜色
 * data 字符串
 * strColor 要变换的颜色
 */
exports.changeColor = (data, strColor) => {
	if (data) {
		return "<span style='color:" + strColor + "'>" + data + "</span>";
	}
	return data || "";
}


exports.toDate = (data, formate) => {
	if (!data) {
		return "";
	}
	if (formate === "yyyy-MM-dd") {
		return data.substr(0, 10)
	}
	if (formate === "yyyy-MM-dd HH:mm:ss") {
		return data.replace("T", " ");
	}
}