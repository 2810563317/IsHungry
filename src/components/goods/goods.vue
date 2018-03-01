<template>
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
						<span class="text border-1px">
							<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper"  ref="foodsScroll">
				<ul>
					<li v-for="item in goods" class="foods-list foods-list-hook">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li @click="selectedFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
								<div class="icon">
									<img width="57" height="57" :src="food.icon" alt="">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
									</div>
									<div class="cartcontral-wrapper">
										<cartcontral @getTarget="_drop" :food="food"></cartcontral>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<showCart ref="showCart" :select-foods="allSelectFoods":delivery-price="deliveryPrice" :min-price="minPrice"></showCart>
		</div>
		<food  @getTarget="_drop" :food="selectFood" ref="food"></food>	
	</div>
	
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import showCart from 'components/showCart/showCart';
	import cartcontral from 'components/cartcontral/cartcontral';
	import food from 'components/food/food';
	import Vue from 'vue';
	import global from '../../common/js/data.vue';
	const ERR_OK = 0;
	export default{
		data() {
			return {
				goods: global.oldGoods,
				listHeight: [],
				scrollY:0,
				deliveryPrice: global.deliveryPrice,
				minPrice: global.minPrice,
				selectFood:{},
				selectFoods:global.selectFoods
			}
		},
		computed: {
			currentIndex() {
				for(let i=0;i < this.listHeight.length; i++){
					let height1=this.listHeight[i]
					let height2=this.listHeight[i+1]
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
						return i
					}
				}
				return 0;
			},
			allSelectFoods(){
				let foods=[];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count){
							foods.push(food)
						}
					})
				})
				global.oldGoods=this.goods;
				global.selectFoods = foods
				return foods
			},
		},
		created() {
		    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
			this.$http.get('/api/goods').then((res) => {
				res=res.body;
				if(res.errno === ERR_OK){
					//global.oldGoods=res.data
					if(global.oldGoods.length==0){
						global.oldGoods=res.data
						this.goods = res.data
					}
					//保证dom已经渲染
					this.$nextTick(() => {
						// 滚动
			         	this._initScroll();  
			         	// 计算每个区间的高度
						this._calculateHeight();
			        })
				}
			})
			this.$http.get('/api/seller').then((res) => {
				res=res.body;
				if(res.errno === ERR_OK){
					
					this.deliveryPrice = res.data.deliveryPrice
					this.minPrice = res.data.minPrice
					
					global.minPrice = res.data.minPrice
					global.deliveryPrice = res.data.deliveryPrice
				}
			})
		},
		methods: {
			selectMenu(index, event) {
				if(!event._constructed){
					//阻止原生事件，使用BScroll的派发事件，否则pc端会调用两次
					return;
				}
				let foodList = this.$refs.foodsScroll.getElementsByClassName('foods-list-hook');
				// 找到相应的li
				let el=foodList[index];
				//滚动到相应位置
				this.foodsScroll.scrollToElement(el,300); 
			},
			_initScroll(){
				 this.menuScroll = new BScroll(this.$refs.menuWrapper, {
				 	click:true
				 })
				 //probeType: 3   实时滚动位置
			     this.foodsScroll = new BScroll(this.$refs.foodsScroll, {
			     	click:true,
			     	probeType: 3 
			     })
			      this.foodsScroll.on('scroll',(pos) => {
			      	this.scrollY=Math.abs(Math.round(pos.y))
			      })
			},
			_calculateHeight(){
				let foodList = this.$refs.foodsScroll.getElementsByClassName('foods-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for(let i = 0; i < foodList.length; i++){
					let item = foodList[i];
					// clientHeight:当前模块的可视高度
					height += item.clientHeight; 
					this.listHeight.push(height);
				}
			},
			//接收子组件cartContral传递出来的参数
			_drop(target){
				//体验优化，异步执行下落动画
				this.$nextTick(() => {
					//访问子组件，调用子组件的方法
					this.$refs.showCart.drop(target)
				})
				//global.selectFoods=this.selectFoods
			},
			selectedFood(food,event){
				if(!event._constructed){
					//阻止原生事件，使用BScroll的派发事件，否则pc端会调用两次
					return;
				}
				this.selectFood=food;
				//global.selectFood=food
				//调用子组件的方法
				this.$refs.food.show()
			}
		},
		components:{
			showCart,
			cartcontral,
			food
		}

	}
</script>

<style lang="less">
@import url("../../common/less/same.less");
	.bg-image(@u){ // 注意点： 只能放在同一个环境中，不能放在same.less中，否则无法引入；
		background-image: url('@{u}@2x.png');
		@media(-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){
			background-image: url('@{u}@3x.png');
		}
	}
	.goods{
		display:flex;
		position:absolute;
		top:174px;
		bottom:46px;
		width:100%;
		overflow:hidden;
		.menu-wrapper{
			flex:0 0 80px;
			width:80px;
			background:#f3f5f7;
			.menu-item{
				display:table;//垂直居中的最好方式
				height:54px;
				width:56px;
				line-height:14px;
				padding:0 12px;
				.icon{
					display:inline-block;
					width:12px;
					height:12px;
					vertical-align:top;
					margin-right:2px;
					background-size:12px 12px;
					background-repeat:no-repeat;
					&.decrease{.bg-image(decrease_3);}
					&.discount { .bg-image(discount_3);}
					&.guarantee { .bg-image(guarantee_3);}
					&.invoice { .bg-image(invoice_3);}
					&.special {.bg-image(special_3);}
				}
				.text{
					display:table-cell;
					width:56px;
					vertical-align:middle;
					font-size:12px;
					.border-1px(rgba(7,17,27,0.1));
				}
				&.current{
					position:relative;
					z-index:10;
					margin-top:-1px;
					font-weight:700;
					background:#fff;
					.text{
						.border-none();
					}
				}
			}
		}
		.foods-wrapper{
			flex:1;
			.title{
				padding-left:14px;
				height:26px;
				line-height:26px;
				border-left:2px solid #d9dde1;
				font-size:12px;
				color:rgb(147,153,159);
				background:#f3f5f7;
			}
			.food-item{
				display:flex;
				margin:18px;
				padding-bottom:18px;
				.border-1px(rgba(7,17,27,0.1));
				&:last-child{
					.border-none();
					margin-bottom:0;
				}
				.icon{
					flex:0 0 57px;
					margin-right:10px;

				}
				.content{
					flex:1;
					.name{
						font-size:14px;
						color:rgb(7,17,27);
						line-height:14px;
						height:14px;
						margin:2px 0 8px 0;
					}
					.desc,.extra{
						font-size:10px;
						line-height:10px;
						color:rgb(147,153,159);
					}
					.desc{
						line-height:12px;
						margin-bottom:8px;
					}
					.extra{
						.count{
							margin-right:12px
						}
					}
					.price{
						font-weight:700;
						line-height:24px;
						.now{
							margin-right:8px;
							font-size:14px;
							color:rgb(240,20,20);
						}
						.old{
							text-decoration:line-through;
							font-size:10px;
							color:rgb(147,153,159);
						}
					}
					.cartcontral-wrapper{
						position:absolute;
						right:0;
						bottom:12px;
					}
				}
			}
		}
	}
</style>
