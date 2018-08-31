'use strict'

const common = {
	//1:处理结果返回的结果
	procResult(data, success, error) {
		if (data.ok == "ok") {
			var jsonData = data.data;
			if (jsonData.Statu == "Y") {
				if (typeof (success) == "function") {
					success(data.data);
				}
			}
		}
		else if (data.status == "401") {
			//身份验证失败
		}
		else {
			//返回结果失败
			if (typeof (fail) == "function") {
				fail(data.data);
			}
		}
	},
	setHeight(){
		localStorage.setItem("height",window.screen.height);
	},
	getHeight(){
		return localStorage.getItem("height");
	},
	getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	getUrlParam(paramName) {
		let url = location.href;
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {}

		for (let i = 0; i < paraString.length; i++) {
			let j = paraString[i];
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paramName.toLowerCase()];

		if (typeof (returnValue) == "undefined") {
			return "";
		} else {
			if (returnValue.indexOf('#') >= 0) {
				returnValue = returnValue.substring(0, returnValue.length - 1);
			}
			return returnValue;
		}
	},
	// 检查是否字段是否都有填写
	checkPostData(postData) {
		return Object.keys(postData).some(u => {
			return postData[u] == "";
		});
	},
	// 情况vue的实例
	clearVm(data) {
		Object.keys(data).some(u => {
			var strType = typeof (data[u]);
			switch (strType) {
				case "string":
					data[u] == "";
					break;
				case "object":
					// 1:检查是否是数组类型
					// if (data[u] instanceof Array) {
					// 	data[u] = [];
					// } else {
					// 	data[u] = undefined;
					// }
					break;
				case "number":
					data[u] = 0;
					break;
			}
		});
	},
	getWXCfg() {
		if (localStorage) {
			var strCfg = localStorage.getItem("wxcfg");
			return JSON.parse(strCfg);
		}
		return false;
	},
	//设置微信
	initWX() {
		if (!wx) {
			return false;
		}
		//设置微信的config
		var wxCfg = common.getWXCfg();
		if (!wxCfg) {
			return false;
		}
		wx.config(wxCfg);
	},
	isCanWeiXin() {
		return wx && wx.config.appId;
	}

}

export default common

