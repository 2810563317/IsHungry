<template>
  <div>
    <!-- 通过prop将seller数据从父组件传给子组件 --> 
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}" >商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import header from 'components/header/header.vue';
import showCart from 'components/showCart/showCart.vue';

const ERR_OK = 0

export default {
  data() {
    return {
      seller: {
        type: Object
      }
    }
  },
  created() {
    this.$http.get('/api/seller').then((res) => {
      // res 是一个promise
      // res = res.json()
      res = res.body
      if (res.errno === ERR_OK) {
        this.seller = res.data
        this.deliveryPrice = res.data.deliveryPrice
        this.minPrice = res.data.minPrice

      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="less">
@import url("./common/less/same.less");
  .tab{
    display:flex;
    width:100%;
    height:40px;
    line-height:40px;
    .border-1px(rgba(7,17,27,0.1));
    .tab-item{
      flex:1;
      text-align:center;
      &>a{
        dispaly:block;
        font-size:14px;
        color:rgb(77,85,93);
        padding:6px 38px;
        &.active{
          color:rgb(240,20,20)
        }
      }

    }
  }
</style>
