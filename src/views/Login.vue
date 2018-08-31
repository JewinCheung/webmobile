<template>
	<div class="page login">
	
		<x-header :left-options="{showBack: false}">
			<p>登陆页</p>
		</x-header>
		<div class="page-bd">
			<div class="loginUrl">
				<img src="../assets/images/login/login.png" alt="用户">
			</div>
			<group>
				<x-input title="账号:" placeholder="长度是5位的工号" :min="5" :max="5" v-model="account"></x-input>
				<x-input title="密码:" placeholder="最短要4位" type="password" :min="3" :max="15" v-model="pwd"></x-input>
			</group>
			<group>
				<x-switch title="是否记忆密码" v-model="isremeber"></x-switch>
			</group>
			<box gap="10px 10px">
				<x-button @click.native="login" type="primary">登录</x-button>
			</box>
		</div>
	
	</div>
</template>



<script>
import { XHeader, Group, XInput, XButton, XSwitch, Box } from 'vux'
import auth from './utils/auth'
export default {
	components: {
		XHeader,
		Group,
		XInput,
		XButton,
		XSwitch,
		Box
	},
	data() {
		return {
			account: '',
			pwd: '',
			isremeber: true,
			device: ''
		}
	},
	mounted: function () {
		if (this.getVersion().ios) {
			this.device = "ios";
		} else if (this.getVersion().android) {
			this.device = "android";
		} else if (this.getVersion().iPhone) {
			this.device = "iPhone";
		} else if (this.getVersion().iPad) {
			this.device = "iPad";
		} else {
			this.device = "web";
		}
	},
	methods: {
		login() {
			//向服务器发起请登录请求
			if (this.account.length != 5) {
				// this.errorMsg="账号必须是五位";
				// this.isPrompt=true;
				// this.$root.dialog={show:true,text:'长度要5位'};
				this.$vux.toast.show({ text: '长度要5位', type: "cancel" });
				return false;
			}

			if (this.pwd.length < 3) {
				// this.errorMsg="密码最小长度是三位:"+this.getVersion().android;
				// this.$root.dialog={show:true,text:'密码长度最短要3位'};
				this.$vux.toast.show({ text: '密码长度最短要3位', type: "cancel" });
				return;
			}

			//向服务器发起请求
			this.$http.get("auth", { params: { "account": this.account, "passwd": this.pwd, "device": this.device } }).then((response) => {
				var data = response.data;
				if (data.Statu == "Y") {

					//保存用户信息到数据库中
					auth.setUser(this.account, data.Data, this.isremeber);
					// //跳转到首页
					// console.log(this.$router)
					this.$router.push("/Index");
					// console.log(this.$route.query.redirect)
					// if (this.$route.query.redirect) {//判断是否有重定向   暂时不能用 
					//重定向后的页面  微信点击返回 会再次回到登录页面 死循环  回不到首页
					// 	this.$router.push({ path: this.$route.query.redirect });

					// } else {

					// 	this.$router.push({ path: '/Index' });

					// }
				} else {

					this.$vux.toast.show({ text: data.Msg, type: "cancel" });
					// this.$root.dialog = { show: true, text: data.Msg };
				}

			});
		},
		getVersion() {
			let u = navigator.userAgent,
				app = navigator.appVersion;
			return { //移动终端浏览器版本信息
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
			};
		}
	}

}

</script>

<style scoped lang="less">
.login {
	.loginUrl {
		text-align: center;
		margin: 30px 5px;
	}
	p {
		font-size: 13px;
	}
}
</style>