<template>
	<div class="page workflow">
		<!--<x-header :left-options="{showBack:true,backText:'返回',preventGoBack:true}" @on-click-back="backIndex()">
													<p>项目信息</p>
													<a slot="right" @click.prevent="goFile">文件上传</a>
												</x-header>-->
		<tab>
			<tab-item :selected="selectIndex === 0" @on-item-click="selectIndex = 0">
				基本信息
			</tab-item>
			<tab-item :selected="selectIndex === 1" @on-item-click="selectIndex = 1">
				文档列表
			</tab-item>
		</tab>
		<swiper v-model="selectIndex" :height="contentHeight" :show-dots="false">
			<swiper-item class="swiperItem">
				<div style="padding-bottom:120px;">
					<group :title="ProjectName">
						<cell title="医院名称">
							<div slot="value">
								<span style="color: green">{{HospName}}</span>
							</div>
						</cell>
						<cell title="产品线">
							<div slot="value">
								<span style="color: green">{{LineName}}</span>
							</div>
						</cell>
						<cell title="项目经理">
							<div slot="value">
								<span style="color: green">{{UserName}}</span>
							</div>
						</cell>
						<cell title="项目金额">
							<div slot="value">
								<span style="color: green">{{ProjectMoney}}</span>
							</div>
						</cell>
						<cell title="项目类型">
							<div slot="value">
								<span style="color: green">{{TypeName}}</span>
							</div>
						</cell>
						<cell title="项目属性">
							<div slot="value">
								<span style="color: green">{{AttrName}}</span>
							</div>
						</cell>
						<cell title="项目状态">
							<div slot="value">
								<span style="color: green">{{StatusName}}</span>
							</div>
						</cell>
						<cell title="项目阶段">
							<div slot="value">
								<span style="color: green">{{StageName}}</span>
							</div>
						</cell>
						<cell title="安装数量">
							<div slot="value">
								<span style="color: green">{{InstallUnit}}</span>
							</div>
						</cell>
						<cell title="入场时间">
							<div slot="value">
								<span style="color: green">{{EnterDate | substr(10)}}</span>
							</div>
						</cell>
						<cell title="验收时间">
							<div slot="value">
								<span style="color: green">{{AcceptDate | substr(10)}}</span>
							</div>
						</cell>
					</group>
				</div>
			</swiper-item>
			<swiper-item class="swiperItem">
				<box gap="10px 10px">
					<x-button @click.native="goFile" type="primary">上传文档</x-button>
				</box>
				<div style="padding-bottom:120px;">
					<group title="已上传文档">
						<cell v-for="item in docList" :key="item.DictName" :title="item.DictName" :value="item.DocDate|substr(10)" track-by="$index">
							<div slot="after-title" class="app_ok" v-if="item.ApproveStatus == 'Y'">已审</div>
							<div slot="after-title" class="app_cancel" v-if="item.ApproveStatus == 'N'">被拒</div>
							<div slot="after-title" class="app_wait" v-if="!item.ApproveStatus">待审</div>
						</cell>
					</group>
				</div>
			</swiper-item>
		</swiper>
	</div>
</template>


<script lang="babel">
	import {
		XHeader,
		Group,
		Cell,
		Box,
		XButton,
		Tab,
		TabItem,
		Swiper,
		SwiperItem
	} from 'vux'
	
	export default {
		name: 'proinfo',
		data() {
			return {
				ProjectCode: '',
				ProjectName: '',
				InstallUnit: 0,
				EnterDate: '',
				HospDept: 0,
				HospName: '',
				ProjectMoney: 0,
				IncomeMoney: '',
				LineName: 0,
				StageName: '',
				StageNo: 0,
				StatusName: '',
				TypeName: 0,
				AcceptDate: '',
				UserName: 0,
				AttrName: '',
				selectIndex: 0,
				docList: [],
				contentHeight: '400px'
			}
		},
		created() {
			this.contentHeight = (this.$parent.dHeight - 44) + 'px';
		},
		beforeRouteEnter: function(to, from, next) {
			next(vm => {
				vm.ProjectCode = vm.$route.params.id;
				vm.loadInfo();
			})
		},
		// watch: {
		// 	'$route': function (to, from) {
		// 		this.ProjectCode = this.$route.params.id;
		// 		//加载基本信息
		// 		// this.loadInfo();
		// 		//重新进入后初始化数据
	
		// 	}
		// },
		components: {
			XHeader,
			Group,
			Cell,
			Box,
			XButton,
			Tab,
			TabItem,
			Swiper,
			SwiperItem
		},
		methods: {
			// 加载项目的基本信息
			loadInfo() {
				var url = "Project/" + this.ProjectCode;
				var docUrl = "SysDict/项目文档";
				//调用远程,加载该项目的基本信息i
				this.$http.get(url).then((success) => {
					// console.log(success.data);
					var project = success.data;
					if (!project) {
						return false;
					}
					console.log(project);
					this.ProjectName = project.ProjectName;
					this.InstallUnit = project.InstallUnit;
					this.EnterDate = project.EnterDate;
					this.HospDept = project.HospDept;
					this.HospName = project.HospName;
					this.ProjectMoney = project.ProjectMoney;
					this.IncomeMoney = project.IncomeMoney;
					this.LineName = project.LineName;
					this.StageNo = project.StageNo;
					this.StageName = project.StageName;
					this.StatusName = project.StatusName;
					this.TypeName = project.TypeName;
					this.AcceptDate = project.DocDate;
					this.UserName = project.UserName;
					this.AttrName = project.AttrName;
	
	
					//加载已经上传的文档
					// if (this.docList.length == 0) {
					this.loadDocList();
					// }
				});
			},
			// 加载项目文档信息
			loadDocList() {
				this.$http.get("Document/GetProjectDoc/" + this.ProjectCode).then((success) => {
					var tempList = success.data;
					if (!tempList || tempList.length == 0) {
						return false;
					}
					this.docList = tempList;
				})
			},
			goFile() {
				this.$router.push("/project/upfile/" + this.ProjectCode + "?stageNo=" + this.StageNo);
			},
			backIndex() {
				this.$router.go({
					name: "project"
				});
			}
		}
	}
</script>

<style>
	.app_ok {
		color: green;
		float: right;
		margin-right: 20px;
		margin-top: -24px;
	}
	
	.app_wait {
		color: orange;
		float: right;
		margin-right: 20px;
		margin-top: -24px;
	}
	
	.app_cancel {
		color: red;
		float: right;
		margin-right: 20px;
		margin-top: -24px;
	}
	
	.swiperItem {
		height: 100%;
		overflow: auto;
	}
</style>