<template>
	<div class="page cservice">
		<scroller lock-x :height="deviceHeight">
			<div :height="deviceHeight">
				<panel :header="groupTitle" :list="Votedate" :type="type" @on-click-item="clickitem"></panel>
			</div>
		</scroller>
	</div>
</template>


<script lang="babel">
	import {
		Group,
		Panel,
		Scroller
	} from 'vux'
	import {
		mapGetters
	} from 'vuex'
	import {
		mapActions
	} from 'vuex'
	export default {
		name: 'vote',
		components: {
			Panel,
			Group,
			Scroller
		},
		data() {
			return {
				type: "5",
				groupTitle: '活动列表',
				Votedate: [],
				deviceHeight: '500px',
				// Votedate: [{
				// 		src: '../../../static/images/app/vote_begin.png',
				// 		title: '冬运会项目投票',
				// 		desc: '冬运会项目投票，精彩活动呈显，请大家踊跃推荐。冬运会项目投票，精彩活动呈显，请大家踊跃推荐。',
				// 		url: '/VoteItemToText/1/2',
				// 		  meta: {
				//   source: '来源信息',
				//   date: '时间',
				//   other: '其他信息'
				// }
				// 	},
				// 	{
				// 		src: '../../../static/images/app/vote_end.png',
				// 		title: '冬运会项目投票',
				// 		desc: '冬运会项目投票，精彩活动呈显，请大家踊跃推荐。冬运会项目投票，精彩活动呈显，请大家踊跃推荐。',
				// 		url: {
				// 			path: '/VoteItemToImg',
				// 			replace: false
				// 		},
				// 		  meta: {
				//   source: '来源信息',
				//   date: '时间',
				//   other: '其他信息'
				// }
	
				// 	}
				// ]
			}
		},
		beforeRouteEnter: function(to, from, next) {
			next(vm => {
				vm.deviceHeight = (vm.$parent.windowHeight) + "px";
				document.title = '活动列表';
				vm.loadInfo();
			})
		},
		mounted: function() {
	
		},
		computed: {
			...mapGetters({
				getVoteGroup: 'getVoteGroup',
			})
	
		},
		methods: {
			...mapActions({
				// 状态管理的方法
				SetVoteGroup: 'SetVoteGroup',
				SetVoteInfo: 'SetVoteInfo'
			}),
			clickitem(item) {
				console.log(item)
				var url = item.page + item.Id + "/" + item.state;
				if (item.type == '3') {
					// this.SetVoteInfo(item);
					this.$router.push(url);
	
				} else {
					this.$http.get("Vote/GetVoteGroup/" + item.Id).then((res) => {
						this.SetVoteGroup(res.data.Data);
						this.SetVoteInfo(item);
						this.$router.push(url);
					});
				}
			},
			loadInfo() {
				//加载活动列表
				this.$http.get("Vote/GetVoteInfo").then((res) => {
					// this.Votedate = res.data;
					// console.log(res.data);
					this.Votedate = res.data.map((Item) => {
						return {
							Id: Item.Id,
							type: Item.type,
							desc: Item.meta.source + ": " + Item.meta.date.replace("T", " "),
							voteDesc: Item.desc,
							page: Item.page,
							src: Item.src,
							state: Item.state,
							title: Item.title,
							StartDate:Item.StartDate.replace("T", " "),
							EndDate:Item.EndDate.replace("T", " ")
						
	
						}
					})
	
					var tourl = this.$route.params.tourl
					var itemInfo = this.Votedate.filter((item) => {
						return tourl == item.Id
					})
	
					if (this.getVoteGroup.length == 0) {
	
						if (itemInfo.length > 0) {
							this.clickitem(itemInfo[0]);
	
						}
					}
	
	
				});
	
			},
	
	
		}
	
	
	}
</script>


      