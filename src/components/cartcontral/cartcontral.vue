<template>
	<div class="cartcontral">
		<transition name="move">
			<div class="cart-decrease" @click.stop.prevent="decreaseCart" v-show="food.count>0">
				<span class="inner icon-remove_circle_outline" ></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';

	export default{

		props:{
			food:{
				type:Object
			}
		},
		created(){
		},
		methods:{
			addCart(event){
				if(!event._constructed){
					return;
				}
				if(!this.food.count){
					// 使用vue.set 添加一个原本不存在的字段，才能检测到该值的变化
					Vue.set(this.food,'count',1)
				}else{
					this.food.count++
				}

				//获取当前元素并传递出去
				this.$emit('getTarget',event.target);

			},
			decreaseCart(event){
				console.log('decrease')
				if(!event._constructed){
					return;
				}
				if(this.food.count){
					this.food.count--
				}
			}
		}
	}
</script>

<style lang="less">
	.cartcontral{
		font-size:0;
		.cart-decrease{
			display:inline-block;
			padding:6px;
			transition: all 0.4s linear;
			&.move-enter-to,&.move-leave{
				opacity:1;
				transform:translate3d(0,0,0);
			}
			.inner{
				display:inline-block;
				font-size:24px;
				line-height:24px;
				color:rgb(0,160,220);
				transition: all 0.4s linear;
				transform:rotate(0)
			}
			&.move-enter,&.move-leave-to{
				opacity:0;
				transform:translate3d(24px,0,0);
				.inner{
					transform:rotate(180deg) 
				}
			}
			
		}
		.cart-count{
			display:inline-block;
			vertical-align:top;
			width:12px;
			padding-top:6px;
			line-height:24px;
			text-align:center;
			font-size:10px;
			color:rgb(147,153,159)
		}
		.cart-add{
			display:inline-block;
			padding:6px;
			font-size:24px;
			line-height:24px;
			color:rgb(0,160,220)
		}
	}
</style>
