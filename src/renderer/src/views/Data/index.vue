<template>
  <div class="data-main">
    <div class="data-edit">
      <ul>
        <li><div class="edit-btn">下载数据</div></li>
        <li><div class="edit-btn" @click="importDataDialog = true">导入数据</div></li>
        <li><div class="edit-btn">删除数据</div></li>
      </ul>

      <div class="search">
        <i class="bx bx-search icon"></i>
        <input type="text" placeholder="查找...." />
      </div>
    </div>
    <div class="data-list" v-if="!stockList">暂无数据!</div>
    <!-- 为了解决当el-table扩大界面时跟着变大，但是缩小时不会跟着缩小的问题 -->
    <div class="data-list" style="position: relative; width: 100%" else>
      <div style="position: absolute; width: 100%; height: 100%; padding: 4px">
        <el-table :data="stockList" border style="width: 100%" table-layout="auto">
          <el-table-column prop="id" label="ID" width="50" />
          <el-table-column prop="stock_code" label="股票代码" min-width="180" />
          <el-table-column
            prop="exchange"
            label="市场代码"
            min-width="150"
            :filters="[
              { text: 'SZ', value: 'SZ' },
              { text: 'SH', value: 'SH' }
            ]"
            :filter-method="exchangeFilterHandler"
          />
          <el-table-column
            prop="date_type"
            label="时间类型"
            min-width="150"
            :filters="[
              { text: '日', value: '日' },
              { text: '小时', value: '小时' },
              { text: '周', value: '周' }
            ]"
            :filter-method="dataTypeFilterHandler"
          />
          <el-table-column prop="start_date" label="开始时间" min-width="150" />
          <el-table-column prop="end_date" label="结束时间" min-width="150" />
        </el-table>

        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          :total="total"
          @current-change="paginationSwitch"
        />
      </div>
      <el-dialog v-model="importDataDialog" width="320">
        <ImportFile></ImportFile>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ImportFile from './components/ImportFile.vue'
import { ref } from 'vue'
import { conformsTo } from 'lodash'
// const api: string =
//   'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz000002&scale=5&ma=5&datalen=1023'

const stockList = ref([])
const importDataDialog = ref(false)

// 分页
const total = ref(100)
const pageSize = ref(18)
const currentPage = ref(1)

onMounted(async () => {
  // @ts-ignore (define in dts)
  stockList.value = await window.api.selectAllStock(currentPage.value, pageSize.value)
  // @ts-ignore (define in dts)
  total.value = await window.api.countStock()
  console.log(total.value)
  console.log(stockList.value[0])
})

const exchangeFilterHandler = (value, row) => {
  return row.exchange === value
}

const dataTypeFilterHandler = (value, row) => {
  return row.date_type === value
}

const paginationSwitch = async () => {
  // @ts-ignore
  stockList.value = await window.api.selectAllStock(currentPage.value, pageSize.value)
}
</script>

<style scoped>
.data-main {
  height: 100vh;
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.data-edit {
  display: flex;
  justify-content: space-between;
  height: 38px;
  margin-bottom: 20px;
}
.data-edit ul {
  display: flex;
}
.data-edit .edit-btn {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  border-radius: 4px;
  background-color: #fff;
  margin-right: 10px;
  color: var(--text-color);
  cursor: pointer;
}
.edit-btn:active {
  background-color: #f4f6fc;
}
.data-edit .search {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
}
.search .icon {
  display: flex;
  justify-content: center;
  min-width: 38px;
  font-size: 21px;
  color: var(--text-color);
}
.search input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}

.data-list {
  padding: 2px;
  width: 100%;
  flex: 1;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  position: absolute;
  right: 46px;
  bottom: 28px;
}
</style>
