<template>
	<div class="header">
	  <div class="content-wrapper">
	  	<div class="avatar">
	  		<img :src="seller.avatar" width="64" height="64">
	  	</div>
	  	<div class="content">
	  		<div class="title">
	  			<span class="brand"></span>
	  			<div class="name">{{seller.name}}</div>
	  		</div>
	  		<div class="description">
	  			{{seller.description}}/{{seller.deliveryTime}}分钟送达
	  		</div>
	  		<div v-if="seller.supports" class="supports">
	  			<span class="icon" :class="classMap[seller.supports[0].type]"></span>
	  			<span class="text">{{seller.supports[0].description}}</span>
	  		</div>
	  	</div>
	  	<div v-if="seller.supports" class="support-cont" @click="showDetail">
	  		<span class="count">{{seller.supports.length}}个</span>
	  		<i class="icon-keyboard_arrow_right"></i>
	  	</div>
	  </div>
	  <div class="bulletin-wrapper" @click="showDetail">
	  	<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
	    <i class="icon-keyboard_arrow_right"></i>
	  </div>
	  <div class="background">
	  	<img :src="seller.avatar" width="100%" height="100%">
	  </div>
	  <!-- 浮层 -->
	  <transition name="fade">
		<div v-show="detailShow" class="detail">
		  	<div class="detail-wrapper clearfix">
		  		<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
					<!-- 评价星星 -->
					<div class="star-wrapper">
						<star :size="48" :score="seller.score"></star>
					</div>
					<div class="title">
						<div class="line"></div>
						<div class="text">优惠信息</div>
						<div class="line"></div>
					</div>
					<ul v-if="seller.supports" class="supports">
						<li class="support-item" v-for="(item, index) in seller.supports">
							<span class="icon" :class="classMap[seller.supports[index].type]"></span>
							<span class="text">{{seller.supports[index].description}}</span>
						</li>
					</ul>
					<div class="title">
						<div class="line"></div>
						<div class="text">商家公告</div>
						<div class="line"></div>
					</div>
					<div class="bulletin">
						<p class="content">{{seller.bulletin}}</p>
					</div>
		  		</div>
		  	</div>
		  	<div class="detail-close">
		  		<i class="icon-close" @click="hiddenDetail"></i>
		  	</div>
		  </div>
	  </transition> 

	</div>
</template>

<script>
	import star from 'components/star/star';
	export default {
	  props: {
	    seller: {type: Object
	    }
	  },
	  data() {
    	return {detailShow: false}
	  },
	  methods: {
    	showDetail() { 
    		this.detailShow = true;
    	},
    	hiddenDetail() { this.detailShow = false }
	  },
	  created() {
	    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
	  },
	  // 注册组件
	  components:{
	  	star 
	  }
	}
</script>

<style lang="less">
.bg-image(@u){ // 注意点： 只能放在同一个环境中，不能放在same.less中，否则无法引入；
	background-image: url('@{u}@2x.png');
	@media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){
		background-image: url('@{u}@3x.png');
	}
}
	.header{
		position:relative;
		color:#fff;
		background:rgba(7,17,27,0.5);
		.content-wrapper{
			padding:24px 12px 18px 24px;
			position:relative;
			font-size:0;
			.avatar{
				display: inline-block;
				vertical-align:top;
				img{
					border-radius:2px;
				}
			}
			.content{
				display: inline-block;
				font-size:14px;
				margin-left:16px;
				.title{
					margin:2px 0 8px 0;
					.brand{
						display: inline-block;
						width:30px;
						height:18px;
						.bg-image(brand);
						background-size:30px 18px;
						vertical-align:top;
					}
					.name{
						display: inline-block;
						margin-left:6px;
						font-size:16px;
						line-height:18px;
						font-weight: bold;
					}
				}
				.description{
					margin-bottom:10px;
					font-size:12px;
					line-height:12px
				}
				.supports{
					.icon{
						display:inline-block;
						vertical-align:bottom;
						width:12px;
						height:12px;
						margin-right:4px;
						background-size:12px 12px;
						background-repeat:no-repeat;
						&.decrease{.bg-image(decrease_1);}
						&.discount { .bg-image(discount_1);}
						&.guarantee { .bg-image(guarantee_1);}
						&.invoice { .bg-image(invoice_1);}
						&.special {.bg-image(special_1);}
					}
					.text{
						line-height:12px;
						font-size:10px;
					}
				}
			}
			.support-cont{
				position:absolute;
				bottom:18px;
				right:12px;
				padding:0 8px;
				height:24px;
				line-height:24px;
				border-radius:14px;
				color:#fff;
				background:rgba(0,0,0,0.2);
				text-align:center;
				.count{
					font-size:10px;
					margin-right:4px;
				}
				.icon-keyboard_arrow_right{
					font-size:10px;
				}
			}
		}
		.bulletin-wrapper{
			height:28px;
			line-height:28px;
			padding:0 12px 0 24px;
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
			position:relative;
			background:rgba(7,17,27,0.2);
			.bulletin-title{
				display:inline-block;
				width:22px;height:12px;
				.bg-image(bulletin);
				background-size:22px 12px;
				background-repeat:no-repeat;
			}
			.bulletin-text{
				font-size:10px;
				vertical-align:top;
				margin:0 4px; 
			}
			.icon-keyboard_arrow_right{
				position:absolute;
				font-size:10px;
				right:10px;
				top:8px;
			}
		}
		.background{
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height:100%;
			z-index:-1;
			/* 模糊 */
			filter:blur(10px);
			overflow:hidden;
		}
		.detail{
			position:fixed;
			top:0;
			left:0;
			z-index:100;
			width:100%;
			height:100%;
			overflow:auto;
			background:rgba(7,17,27,0.8);
			transition:all 0.5s;
			backdrop-filter:blur(10px);
			&.fade-enter-active,&.fade-leave-active{
			   transition:opacity 0.5s linear;
			   background:rgba(7,17,27,0.8);
			}
			&.fade-enter,&.fade-leave-to{
			  opacity: 0;
			  background:rgba(7,17,27,0);
			}

			.detail-wrapper{
				width:100%;
				min-height:100%;
				.detail-main{
					margin-top:64px;
					padding-bottom:64px;
					.name{
						line-height:16px;
						text-align:center;
						font-size:16px;
						font-weight:700;
					}
					.star-wrapper{
						margin-top:18px;
						padding:2px 0;
						text-align:center;
					}
					.title{
						width:80%;
						margin:28px auto 24px;
						display:flex;
						.line{
							flex:1;
							position:relative;
							top:-6px;
							border-bottom:1px solid rgba(255,255,255,0.2);
						}
						.text{
							padding:0 12px;
							font-weight:700;
							font-size:14px
						}
					}
					.supports{
						width:80%;
						margin:0 auto;
						.support-item{
							width:100%;
							padding:0 12px;
							margin-bottom:12px;
							font-size:0;
							&:last-child{
								margin-bottom:0;
							}
							.icon{
								display:inline-block;
								width:16px;
								height:16px;
								vertical-align:top;
								margin-right:6px;
								background-size:16px 16px;
								background-repeat:no-repeat;
								&.decrease{.bg-image(decrease_2);}
								&.discount { .bg-image(discount_2);}
								&.guarantee { .bg-image(guarantee_2);}
								&.invoice { .bg-image(invoice_2);}
								&.special {.bg-image(special_2);}
							}
							.text{
								line-height:16px;
								font-size:12px
							}
							
						}
					}
					.bulletin{
						width:80%;
						margin:0 auto;
						.content{
							padding:0 12px;
							line-height:24px;
							font-size:12px;
						}
					}
				}
				
			}
			.detail-close{
				position:relative;
				width:32px;
				height:32px;
				margin:-64px auto 0 auto;
				clear:both;
				font-size:32px;
			}
		}
	}
</style>