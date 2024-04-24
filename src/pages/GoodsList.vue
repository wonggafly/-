<template>
  <div>
    <button @click="fetchData">获取数据</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  // 组件选项
  methods: {
    fetchData() {
      axios.get('/prod-api/press/category/list')
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data);
          // 在这里处理返回的数据，比如更新组件中的数据
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
  }
}
</script>

<style>

</style>