<template>
<div>
	<div class="container" >
		<div class="container-wrapper" ref="container">
		<div>
			<div class="ratings">
				<div class="score-wrapper">
					<div class="score-left">
						<h2 class="score">{{seller.score}}</h2>
						<h3 class="text">综合评分</h3>
						<p class="rankRate">高于周边商家{{seller.rankRate}}</p>
					</div>
					<ul class="score-right">
						<li class="item">
							<span class="label">服务态度</span><star :size="36" :score="seller.serviceScore"></star><span class="score">{{seller.serviceScore}}</span>
						</li>
						<li class="item">
							<span class="label">商品描述</span><star :size="36" :score="seller.foodScore"></star><span class="score">{{seller.foodScore}}</span>
						</li>
						<li class="item">
							<span class="label">送达时间</span><span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="rating">
				<ratingselect @ratingselect='selectTypeFC' :desc="desc" :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
				<div class="rating-wrapper">
					<ul v-show="ratings && ratings.length">
						<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item border-1px">
							<img class="avatar" width="12" height="12" :src="rating.avatar"/>
							<div class="content">
								<div class="user">
									<div>
										<span class="name">{{rating.username}}</span>
										<span class="time">{{rating.rateTime | formatDate}}</span>
									</div>
									<div class="star">
										<star :size="36" :score="rating.score"></star>
									</div>
									<span class="deliveryTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>	
								</div>
								<p class="text">
									{{rating.text}}
								</p>
								<div class="description">
									<span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
									<div class="recommend">
										<span class="key" v-for="key in rating.recommend">{{key}}</span>
									</div>
									
								</div>
							</div>
							
						</li>
					</ul>
					<div class="no-rating" v-show="!ratings || !ratings.length">暂无评价</div>
				</div>
			</div>
		</div>
			
		</div>	
		<showCart ref="showCart" :select-foods="selectFoods":delivery-price="deliveryPrice" :min-price="minPrice"></showCart>
	</div>
</div>
	

</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';
	import BScroll from 'better-scroll';
	import star from 'components/star/star';
	import split from 'components/split/split';
	import {formatDate} from '../../common/js/date'; 
	import ratingselect from 'components/ratingselect/ratingselect';
	import showCart from 'components/showCart/showCart';
	import global from '../../common/js/data.vue';
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;

	const ERR_OK = 0;
	export default{
		data() {
			return {
				ratings:[],
				seller:[],
				selectType:ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				},
				selectFoods:global.selectFoods,
				deliveryPrice:global.deliveryPrice,
				minPrice:global.minPrice
			}
		},
		created() {
			this.$http.get('/api/ratings').then((res) => {
				res=res.body;
				if(res.errno === ERR_OK){
					this.ratings = res.data
					this.$nextTick(() => {
						if(!this.scroll){
							this.scroll = new BScroll(this.$refs.container,{
								click:true
							})
						}else{
							this.scroll.refresh();
						}
					})

				}
			})
			this.$http.get('/api/seller').then((res) => {
				res=res.body;
				if(res.errno === ERR_OK){
					this.seller = res.data;
					this.deliveryPrice = res.data.deliveryPrice
					this.minPrice = res.data.minPrice
					global.minPrice = res.data.minPrice
					global.deliveryPrice = res.data.deliveryPrice

				}
			})


		},
		methods:{
			selectTypeFC(e){
				this.selectType = e.selectType
				this.onlyContent = e.toggleContent
				//异步更新DOM
				this.$nextTick(() => {
					this.scroll.refresh();
				})
			},
			needShow(type,text){
				if(this.onlyContent && !text){
					return false;
				}
				if(this.selectType === ALL){
					return true;
				}else{
					return type === this.selectType
				}

			}
		},
		filters:{
			formatDate(time){
				let date = new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		components:{
	  		star,
	  		split,
	  		ratingselect,
	  		showCart
	  	}	
	}
</script>

<style lang="less">
@import url("../../common/less/index.less");
	.container{
		width:100%;
		position:absolute;
		top:174px;
		left:0;
		bottom:46px;
		overflow:hidden;
		/*   为了让购物车列表滚动时内层内容不滚动   */
		display:flex;
		.container-wrapper{
			flex:1;
		}
		.ratings{
			padding:18px 0;
			.score-wrapper{
				display:flex;
				.score-left{
					flex:0 137.5px;
					text-align:center;
					.score{
						margin-bottom:6px;
						font-size:24px;
						font-weight:400;
						line-height:28px;
						color:rgb(255,153,0);
					}
					.text{
						font-size:12px;
						line-height:12px;
						color:rgb(7,17,27);
						font-weight:400;
					}
					.rankRate{
						margin:8px 0 6px;
						font-size:10px;
						line-height:10px;
						color:rgb(147,153,159);
					}
				}
				.score-right{
					flex:1;
					padding:0 24px;
					border-left:1px solid rgba(7,17,27,0.1);
					vertical-align:top;
					.item{
						line-height:18px;
						.label{
							display:inline-block;
							font-size:12px;
							line-height:18px;
							color:rgb(7,17,27);
						}
						.star{
							display:inline-block;
							margin:0 12px;
						}
						.score{
							display:inline-block;
							font-size:12px;
							line-height:18px;
							color:rgb(255,153,0);
						}
						.deliveryTime{
							display:inline-block;
							margin-left:12px;
							font-size:12px;
							line-height:18px;
							color:rgb(147,153,159);
						}
					}
					
				}
			}
			
		}
		.rating{
				padding-top:18px;
				.title{
					font-size:14px;
					line-height:14px;
					margin-left:18px;
					color:rgb(7,17,27)
				}
				.rating-wrapper{
					padding:0 18px;
					.rating-item{
						display:flex;
						padding:18px 0;
						.border-1px(rgba(7,17,27,0.1))
					}
					.rating-item{
						.avatar{
							flex:0 28px;
							width:28px;
							height:28px;
							border-radius:50%;
						}
						.content{
							flex:1;
							margin-left:12px;
							.user{
								.name{

									font-size:10px;
									line-height:12px;
									color:rgb(7,17,27);
								}
								.time{
									float:right;
									font-size:10px;
									font-weight:200;
									line-height:12px;
									color:rgb(147,153,159);
								}
								.star{
									display:inline-block;
									margin:4px 6px 6px 0;

								}
								.deliveryTime{
									display:inline-block;
									font-size:10px;
									font-weight:200;
									line-height:12px;
									color:rgb(147,153,159);
								}
							}
							.text{
								margin-bottom:8px;
								font-size:12px;
								line-height:18px;
								color:rgb(7,17,27);
							}
							.description{
								display:flex;
								line-height:16px;

								.icon-thumb_up{
									color:rgb(0,160,220);
								}
								.icon-thumb_down{
									color:rgb(147,153,159);
								}
								.icon-thumb_up,.icon-thumb_down{
									flex:0 16px;
									line-height:16px;
									font-size:12px;
								}
								.recommend{
									flex:1;
									.key{
										display:inline-block;
										margin-left:8px;
										padding:0 6px;
										border:1px solid rgba(7,17,27,0.1);
										border-radius:2px;
										background:#fff;
										font-size:9px;
										line-height:16px;
										color:rgb(147,153,159);	
										max-width:60px;
										overflow: hidden;
							            white-space: nowrap;
							            text-overflow:ellipsis;
									}
								}
								
							}
						}
					}
					.no-rating{
						padding:16px 0;
						font-size:12px;
						color:rgb(147,153,159)
					}
					
				}
		}
	}

</style>
