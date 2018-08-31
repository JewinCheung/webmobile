<template>
	<div class="page logDetail">
		<x-header :left-options="{showBack:false,backText:'返回'}">
			<p>{{curDay}}</p>
		</x-header>
		<div class="weui-tab-bd">
			<group title="时间">
				<datetime v-model="sTime" format="YYYY-MM-DD HH:mm" title="开始时间" confirm-text="完成" cancel-text="取消"></datetime>
				<datetime v-model="eTime" format="YYYY-MM-DD HH:mm" title="结束时间" confirm-text="完成" cancel-text="取消"></datetime>
			</group>
			<group title="内容信息">
				<popup-picker title="工作类型" :data="typeOptions" v-model="wType"></popup-picker>
				<cell title="选择项目" v-show="showPro" is-link @click.native="showPop">
					<span slot="value">{{ projectName | substr(10,true) }}</span>
				</cell>
				<x-input :min="3" :max="20" v-model="subTitle" is-type="china_name" placeholder="日志标题:长度3~20"></x-input>
				<x-textarea :max="200" :row="8" :height="200" v-model="remark" placeholder="请填写日志内容"></x-textarea>
				<box gap="10px 10px">
					<x-button @click.native="saveLog" type="primary">
						提交
					</x-button>
				</box>
			</group>
		</div>
	
		<popup v-model="popshow" height="90%">
			<div class="popbd">
				<group title="我主导的项目">
					<cell v-for="item in mainData" :key="item.projectName" :title="item.text" @click.native="choosePro(item)">
					</cell>
				</group>
				<!-- </scroller> -->
				<group title="我参与的项目">
					<!-- <scroller lock-x> -->
					<cell v-for="item in partData" :key="item.projectName" :title="item.text" @click.native="choosePro(item)">
					</cell>
				</group>
			</div>
		</popup>
	</div>
</template>


<script lang="babel">
	import {
		PopupPicker,
		Group,
		XInput,
		Datetime,
		XTextarea,
		XButton,
		Box,
		XHeader,
		Cell,
		Popup,
		Search,
		Scroller
	} from 'vux'
	import common from '../utils/common'
	export default {
		name: 'logdetail',
		data() {
			return {
				curDay: '',
				type: '',
				typeOptions: [
					[
						"项目工作",
						"日常工作"
					]
				],
				mainData: [],
				partData: [],
				wType: ['项目工作'],
				remark: '',
				projectCode: '',
				projectName: '',
				sTime: '',
				eTime: '',
				popshow: false,
				subTitle: ''
			}
		},
		// mounted: function() {
		// 	//加载数据
		// 	this.loadInfo();
		// },
		watch: {
			wType: function(value) {
				if (value != "项目工作") {
					this.project = {
						"id": '',
						"text": ''
					};
				}
			},
		},
		beforeRouteEnter: function(to, from, next) {
			next(vm => {
				vm.loadInfo();
			})
		},
		computed: {
			subTitle() {
				//通过选择的值找到
				var workType = this.wType[0];
				this.subTitle = '[' + this.curDay + ']' + workType;
			},
			showPro() {
				return this.wType[0] == "项目工作";
			}
		},
		components: {
			PopupPicker,
			Group,
			XInput,
			Datetime,
			XTextarea,
			XButton,
			Box,
			XHeader,
			Cell,
			Popup,
			Search,
			Scroller
		},
	
		methods: {
			loadInfo() {
	
				this.clearForm();
				// var date = new Date();
				//加载数据
	
				this.curDay = this.$route.query.date;
				this.type = this.$route.query.type == "add" || 'edit';
				this.sTime = this.curDay + ' 08:50';
				this.eTime = this.curDay + ' 17:50';
				//通过选择的值找到
				var workType = this.wType[0];
				this.subTitle = '[' + this.curDay + ']' + workType;
			},
	
			choosePro(item) {
				this.popshow = false;
				this.projectCode = item.id;
				this.projectName = item.text;
			},
			//查询
			showPop() {
				//加载项目信息
				if (this.mainData.length == 0) {
					//加载数据
					this.$http.get("Project").then((success) => {
						var jsonData = success.data;
						if (jsonData.length == 0) {
							return false;
						}
						this.mainData = jsonData.filter((item) => {
							return item.desc == "main";
						});
						this.partData = jsonData.filter((item) => {
							return item.desc == "part";
						});
						this.popshow = true;
					})
				} else {
					this.popshow = true;
				}
			},
			clearForm() {
				this.remark = '';
				this.projectCode = "";
				this.projectName = "";
			},
			loadMore(index) {
				var index = type == 0 ? this.mainIndex : this.partIndex;
				this.$http.get('Project', {
					type: type,
					pageIndex: index
				}).then((response) => {
					if (type == 0) {
						this.mainData = response.data;
					} else {
						this.partData = response.data;
					}
	
				}, (error) => {
	
				})
			},
			getWTypeName(name) {
				switch (name) {
					case "项目工作":
						return "XMGZLB";
					case "日常工作":
						return "RCGZLB";
					default:
						return ""
				}
			},
			saveLog() {
				//1:提交表单内容
				var postData = {
					SubTitle: this.subTitle,
					StartTime: this.sTime,
					EndTime: this.eTime,
					WorkType: this.getWTypeName(this.wType[0]),
					Remark: this.remark
				};
				console.log()
	
				//检查如果日志类别的话,提示请选择项目名称
				var isFalse = common.checkPostData(postData);
				if (isFalse) {
					this.$vux.toast.show({
						text: '请填写必填项',
						type: "cancel"
					});
					return false;
				}
				postData["ProjectCode"] = "";
				//1:检查是否包含项目工作
				if (postData.WorkType == "XMGZLB") {
					var proCode = this.projectCode;
					if (proCode.length == 0) {
						this.$vux.toast.show({
							text: '请选择项目',
							type: "cancel"
						});
						return false;
					}
					postData["ProjectCode"] = proCode;
				}
	
	
				this.$http.post("WorkLog", postData).then((success) => {
					//提示保存成功
					this.$vux.toast.show({
						text: success.data.Msg,
						type: "ok"
					});
					//清空表单信息
					this.clearForm();
					//设置
					this.$router.push("/worklog");
	
	
				}, (error) => {
	
				});
			}
		}
	}
</script>

<style type="text/css">
	.weui_label {
		width: 4em;
	}
	
	.logDetail .page-bd {
		padding-bottom: 30px;
		overflow: auto;
	}
	
	.popbd {
		height: 100%;
		overflow-y: auto;
	}
</style>