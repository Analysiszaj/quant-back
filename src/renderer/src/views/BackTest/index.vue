<template>
  <div class="back-main">
    <div class="select-box animate__fadeOut"></div>
    <div class="display-box">
      <div class="back-chart animate__fadeOut"></div>
      <div class="back-table animate__fadeOut"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.back-main {
  display: flex;
  padding: 14px;
}

.select-box {
  flex: 1;
  height: 100%;
  background-color: white;
}
.display-box {
  display: flex;
  flex-direction: column;
  flex: 2;
  height: 100%;
  margin-left: 20px;
}
.display-box .back-chart {
  flex: 2;
  background-color: #fff;
}
.display-box .back-table {
  flex: 2;
  background-color: #fff;
  margin-top: 20px;
}
</style>
