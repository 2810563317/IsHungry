<template>
	<div class="container" >
		
		<div class="container-wrapper" ref="container">
			<div>
				<div class="seller-item seller">
					<div class="seller-wrapper border-1px">
						<div class="seller-wrapper-left">
							<div class="title">{{seller.name}}</div>
							<div class="star-wrapper">
								<div class="star"><star :size="36" :score="seller.serviceScore"></star></div>
								<span class="ratingCount">({{seller.ratingCount}})</span>
								<span class="sellCount">月售{{seller.sellCount}}单</span>
							</div>	
						</div>
						<div class="seller-wrapper-right">
							<div class="wrapper">
								<p class="icon-favorite favorite"></p>
								<p class="text">已收藏</p>
							</div>
						</div>
					</div>
					<div class="seller-info">
						<div class="info-item">
							<p class="label">起送价</p>
							<p class="value"><span class="price">{{seller.minPrice}}</span>元</p>
						</div>
						<div class="info-item middle">
							<p class="label">商家配送</p>
							<p class="value"><span class="price">{{seller.deliveryPrice}}</span>元</p>
						</div>
						<div class="info-item">
							<p class="label">平均配送时间</p>
							<p class="value"><span class="price">{{seller.deliveryTime}}</span>分钟</p>
						</div>
					</div>
				</div>
				<split></split>
				<div class="seller-item active">
					<div class="title">公告与活动</div>
					<div class="active-info">{{seller.bulletin}}</div>
					<div v-if="seller.supports" class="supports">
						<p class="support-item border-top-1px" v-for="(item, index) in seller.supports" >
							<span class="icon" :class="classMap[seller.supports[index].type]"></span><span class="text">{{seller.supports[index].description}}</span>
						</p>
					</div>
				</div>
				<split></split>
				<div class="seller-item seller-imgs">
					<div class="title">商家实景</div>
					<div class="imgs" ref="imgs">
						<ul class="imgs-wrapper" ref="imgsWrapper">
							<li  v-for="pic in seller.pics" class="img-item" >
								<img :src="pic" alt="">
							</li>
							
						</ul>
					</div>
				</div>
				<split></split>
				<div class="seller-item seller-info">
					<div class="title">商家信息</div>
					<div class="info-item">
						<p v-for="info in seller.infos" class="info border-top-1px">{{info}}</p>
					</div>
				</div>
			</div>
		</div>

		<showCart ref="showCart" :select-foods="selectFoods":delivery-price="deliveryPrice" :min-price="minPrice"></showCart>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';
	import BScroll from 'better-scroll';
	import star from 'components/star/star';
	import split from 'components/split/split';
	import showCart from 'components/showCart/showCart';
	import global from '../../common/js/data.vue';
	const ERR_OK = 0;
	export default{
		data() {
			return {
				seller:[],
				selectFoods:global.selectFoods,
				deliveryPrice:global.deliveryPrice,
				minPrice:global.minPrice
			}
		},
		created() {
		 this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
			this.$http.get('/api/seller').then((res) => {
				res=res.body;
				if(res.errno === ERR_OK){
					this.seller = res.data
					this.seller = res.data;
					this.deliveryPrice = res.data.deliveryPrice
					this.minPrice = res.data.minPrice
					global.minPrice = res.data.minPrice
					global.deliveryPrice = res.data.deliveryPrice
					this.$nextTick(() => {
						if(!this.scroll){
							this.scroll = new BScroll(this.$refs.container,{
								click:true
								
							})
						}else{
							this.scroll.refresh();
						}
					})
					this.InitImgScroll();
				}
			})
		},
		methods:{
			InitImgScroll(){
                let width=0
                let len=this.seller.pics.length
                width = 109 * len + 6 * (len - 1);

                this.$refs.imgsWrapper.style.width=width+'px'
                this.$nextTick(()=>{
                    if (!this.imgScroll) {
                        this.imgScroll=new BScroll(this.$refs.imgs, {
                            startX:0,
                            click:true,
                            scrollX:true,
                            scrollY:false,
                            eventPassthrough:'vertical'
                        })
                    }else{
                        this.imgScroll.refresh()
                    }
                })
            }
		},
		computed: {
			
		},
		components:{
	  		star,
	  		split,
	  		showCart
	  	}
	}
</script>

<style lang="less">
@import url("../../common/less/index.less");
.bg-image(@u){ // 注意点： 只能放在同一个环境中，不能放在same.less中，否则无法引入；
	background-image: url('@{u}@2x.png');
	@media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){
		background-image: url('@{u}@3x.png');
	}
}
	.container{
		width:100%;
		position:absolute;
		top:174px;
		left:0;
		bottom:46px;
		overflow:hidden;
		display:flex;
		.container-wrapper{
			flex:1;
			width:100%;
		}
		.seller-item{
			padding:18px 18px 0;
			.title{
				font-size:14px;
				line-height:14px;
				color:rgb(7,17,27);
				margin-bottom:8px;
			}
		}
		.seller{
			.seller-wrapper{.border-1px(rgba(7,17,27,0.1))}
			.seller-wrapper{
				padding-bottom:18px;
				display:flex;
				.seller-wrapper-left{
					flex:1;
					.star-wrapper{
						.star{
							display:inline-block;
							vertical-align:top;
						}
						.ratingCount{
							display:inline-block;
							font-size:10px;
							line-height:18px;
							color:rgb(77,85,93);
							margin:0 12px 0 8px;
						}
						.sellCount{
							display:inline-block;
							font-size:10px;
							line-height:18px;
							color:rgb(77,85,93);
						}
						
					}
				}
				.seller-wrapper-right{
					flex:0 80px;
					text-align:right;
					.wrapper{
						display:inline-block;
						text-align:center;
						.favorite{
							display:inline-block;
							margin-bottom:4px;
							font-size:24px;
							line-height:24px;
							color:rgb(240,20,20);
						}
						.text{
							font-size:10px;
							line-height:10px;
							color:rgb(77,85,93);
						}
					}	
				}
			}
			.seller-info{
				padding:18px 0;
				display:flex;
				.info-item{
					flex:1;
					text-align:center;

					&.middle{
						border-left:1px solid rgba(7,17,27,0.1);
						border-right:1px solid rgba(7,17,27,0.1);
					}
					.label{
						margin-bottom:4px;
						font-size:10px;
						line-height:10px;
						color:rgb(147,153,159);
					}
					.value{
						font-size:10px;
						line-height:24px;
						font-weight:200;
						color:rgb(7,17,27);
						.price{
							font-size:24px;
						}	
					}
				}
			}
		}
		.active{
			.active-info{
				font-size:12px;
				font-weight:200;
				line-height:24px;
				color:rgb(240,20,20);
				padding-bottom:16px;
			}
			.supports{
				.support-item{
					padding:16px 0 16px 12px;
					//border-top:1px solid rgba(7,17,27,0.1);
					
				}
				.support-item{
					.border-top-1px(rgba(7,17,27,0.1))
				}
				.icon{
					display:inline-block;
					vertical-align:bottom;
					width:16px;
					height:16px;
					margin-right:6px;
					background-size:16px 16px;
					background-repeat:no-repeat;
					&.decrease{.bg-image(decrease_1);}
					&.discount { .bg-image(discount_1);}
					&.guarantee { .bg-image(guarantee_1);}
					&.invoice { .bg-image(invoice_1);}
					&.special {.bg-image(special_1);}
				}
				.text{
					font-size:12px;
					font-weight:200;
					line-height:16px;
					color:rgb(7,17,27);
				}
			}
		}
		.seller-imgs{
			padding-bottom:16px;
			.title{
				margin-bottom:18px;
			}
			.imgs{
				width:100%;
				overflow:hidden;
				.imgs-wrapper{
					height:90px;
					.img-item{
						float:left;
						margin-left:6px;
						width:109px;
						height:90px;
						&:first-child{
							margin-left:0;
						}
						img{
							width:100%;
							height:100%;
						}
					}
				}
				
			}
		}
		.seller-info{
			.title{
				margin-bottom:18px;
			}
			
			.info-item{
				.info{.border-top-1px(rgba(7,17,27,0.1))}
				.info{
					padding:16px 12px;
					font-size:12px;
					font-weight:200;
					line-height:16px;
					color:rgb(7,17,27);
				}
			}

		}
	}

</style>
