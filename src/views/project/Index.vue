<template>
	<div class="page">
		<!--<x-header :left-options="{showBack:true,backText:'返回',preventGoBack:true}" @on-click-back="backIndex()">
																						<p>项目信息</p>
																					</x-header>-->
		<tab>
			<tab-item :selected="selectIndex === 0" @on-item-click="switchTab(0)">
				我主导项目
			</tab-item>
			<tab-item :selected="selectIndex === 1" @on-item-click="switchTab(1)">
				我参与项目
			</tab-item>
		</tab>
	
		<swiper v-model="selectIndex" :height="contentHeight" :show-dots="false">
			<swiper-item class="swiperItem">
				<div class="box2">
					<group>
						<cell v-for="item in mainData" :key="item.name" is-link :link="{path:'/project/projectinfo/'+item.value}">
							<div slot="after-title">
								<span style="color: black">{{item.name | substr(20)}}</span>
							</div>
						</cell>
					</group>
				</div>
				<x-button @click.native="mainMore" v-show="showMainBtn">点击加载更多</x-button>
				<div v-show="!showMainBtn" style="padding:10px 15px;color:blue;border:1px solid whitesmoke;">已经加载到最后了(●'◡'●)</div>
			</swiper-item>
			<swiper-item class="swiperItem">
				<div class="box2">
					<group>
						<cell v-for="item in partData" :key="item.name" is-link :link="{path:'/project/projectinfo/'+item.value}">
							<div slot="after-title">
								<span style="color: black;">{{item.name | substr(20)}}</span>
							</div>
						</cell>
					</group>
				</div>
				<x-button @click.native="partMore" v-show="showPartBtn">点击加载更多</x-button>
				<div v-show="!showPartBtn" style="padding:10px 15px;color:blue;border:1px solid whitesmoke;">已经加载到最后了(●'◡'●)</div>
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
	// 获取状态管理
	// import {Tab,TabItem,XHeader,Cell,Box,XButton} from 'vux-components'
	export default {
		name: 'project',
		components: {
			Group,
			Tab,
			TabItem,
			XHeader,
			Cell,
			Box,
			XButton,
			Swiper,
			SwiperItem
		},
		data() {
			return {
				mainData: [],
				partData: [],
				selectIndex: 0,
				mainIndex: 0,
				partIndex: 0,
				srcType: '',
				showMainBtn: true,
				showPartBtn: true,
				contentHeight: '400px'
			}
		},
		created() {
			this.contentHeight = (this.$parent.dHeight - 44) + 'px';
	
	
		},
		mounted: function() {
			this.switchTab(0);
		},
		methods: {
			switchTab(flag) {
				this.selectIndex = flag;
				if (flag == 0 && this.mainData.length == 0) {
					this.mainMore();
				} else if (flag == 1 && this.partData.length == 0) {
					this.partMore();
				}
			},
			mainMore() {
				var _this = this;
				_this.$http.get('Project/GetByPage', {
					params: {
						type: 0,
						pageIndex: _this.mainIndex
					}
				}).then((response) => {
					var jsonData = response.data;
					if (jsonData.length == 0) {
						_this.showMainBtn = false;
						return false;
					}
					if (_this.mainIndex == 0) {
						_this.mainData = response.data;
					} else {
						jsonData.forEach(u => {
							_this.mainData.push(u);
						})
					}
					_this.mainIndex++;
				})
			},
			partMore() {
				var _this = this;
				_this.$http.get('Project/GetByPage', {
					params: {
						type: 1,
						pageIndex: _this.partIndex
					}
				}).then((response) => {
					var jsonData = response.data;
					if (jsonData.length == 0) {
						_this.showPartBtn = false;
						return false;
					}
					if (_this.mainIndex == 0) {
						_this.partData = response.data;
					} else {
						jsonData.forEach(u => {
							_this.partData.push(u);
						})
					}
					_this.partIndex++;
				})
			},
			backIndex() {
				this.$router.push("/index");
			}
		},
	}
</script>


<style>
	.subdb {
		padding-bottom: 40px;
	}
	
	.swiperItem {
		height: 100%;
		overflow: auto;
	}
</style>