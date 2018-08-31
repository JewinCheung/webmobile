<template>
	<div class="page logInfo">
		<!-- <x-header :left-options="{showBack:true,backText:'返回',preventGoBack:true}" @on-click-back="backIndex()">
				<p></p>
				<a @click="addTask" slot="right">新增</a>
			</x-header> -->
		<box gap="10px 10px">
			<x-button @click.native="addTask" type="primary">[{{curDay}}] 新增</x-button>
		</box>
		<group>
			<cell v-for="item in logInfo":key='item.LogTitle'>
				<div slot="after-title">
					<table class="log">
						<tbody>
							<tr>
								<td class="tdLabel">日志名称</td>
								<td>{{item.LogTitle}}</td>
							</tr>
	
							<tr>
								<td class="tdLabel">开始时间</td>
								<td>{{item.SDate}}</td>
							</tr>
							<tr>
								<td class="tdLabel">结束时间</td>
								<td>{{item.EDate}}</td>
							</tr>
							<tr>
								<td class="tdLabel">工作类型</td>
								<td>{{item.WType}}</td>
							</tr>
	
							<tr>
								<td class="tdLabel">详细信息</td>
								<td v-html="item.Remark">{{ item.Remark | replace('\n','&lt;br /&gt;')}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</cell>
		</group>
	</div>
</template>


<script lang="babel">
	import {
		Group,
		Cell,
		XHeader,
		Box,
		XButton
	} from 'vux'
	import auth from '../utils/auth'
	
	export default {
		name: 'loginfo',
		data() {
			return {
				curDay: '',
				logInfo: [],
				rightBtn: {
					showMore: true
				}
			}
		},
		// mounted: function () {
	
		// 	this.loadInfo();
	
		// },
		// watch: {
		// 	'$route': 'loadInfo'
		// },
		beforeRouteEnter: function(to, from, next) {
			next(vm => {
				vm.loadInfo();
			})
		},
		components: {
			Cell,
			Group,
			XHeader,
			Box,
			XButton
		},
		methods: {
			backIndex() {
				this.$router.push("/worklog");
			},
			addTask() {
				var addPath = "/worklog/logdetail/?date=" + this.curDay + "&type=add";
				this.$router.push({
					path: addPath
				});
			},
			loadInfo() {
				//加载数据
				this.curDay = this.$route.params.date;
				var rUrl = 'WorkLog/' + this.curDay + "";
				if (this.curDay) {
					this.$http.get(rUrl).then((response) => {
						this.logInfo = response.data;
					}, (error) => {
	
					});
				}
	
			}
		}
	}
</script>

<style type="text/css">
	.logInfo table {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
	}
	
	.logInfo tr {
		border-bottom: 1px dashed lightblue;
	}
	
	.logInfo tr:last-child {
		border-bottom: none;
	}
	
	.logInfo td {
		padding: 5px;
	}
	
	.tdLabel {
		width: 100px;
	}
</style>