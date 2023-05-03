<template>
  <div class="data-main">
    <div class="data-edit">
      <ul>
        <li><div class="edit-btn">下载数据</div></li>
        <li><div class="edit-btn" @click="importDataDialog = true">导入数据</div></li>
        <li><div class="edit-btn" @click="batchDelete">批量删除</div></li>
      </ul>

      <div class="search">
        <i class="bx bx-search icon"></i>
        <input type="text" placeholder="查找...." v-model="queryKey" @input="queryChange" />
      </div>
    </div>
    <div class="data-list" v-if="!stockList">暂无数据!</div>
    <!-- 为了解决当el-table扩大界面时跟着变大，但是缩小时不会跟着缩小的问题 -->
    <div class="data-list" style="position: relative; width: 100%" else>
      <div style="position: absolute; width: 100%; height: 100%; padding: 4px">
        <el-table
          :data="stockList"
          border
          style="width: 100%"
          table-layout="auto"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="50" align="center" />
          <el-table-column prop="stock_code" label="股票代码" min-width="180" align="center" />
          <el-table-column
            prop="exchange"
            label="市场代码"
            min-width="100"
            :filters="[
              { text: 'SZ', value: 'sz' },
              { text: 'SH', value: 'sh' }
            ]"
            :filter-method="exchangeFilterHandler"
            align="center"
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
            align="center"
          />
          <el-table-column prop="start_date" label="开始时间" min-width="150" align="center" />
          <el-table-column prop="end_date" label="结束时间" min-width="150" align="center" />
          <el-table-column label="操作" width="210" align="center">
            <template #default="scope">
              <el-button size="small" @click="openStockDetail(scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="deleteHandle(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button size="small" type="success">导出</el-button>
            </template>
          </el-table-column>
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
        <ImportFile @switch-dialog="switchDialog"></ImportFile>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImportFile from './components/ImportFile.vue'
import { ref, onMounted } from 'vue'
// const api: string =
//   'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz000002&scale=5&ma=5&datalen=1023'

const stockList = ref([])
const importDataDialog = ref(false)
const queryKey = ref('')
const multipleSelection = ref([])

// 分页
const total = ref(100)
const pageSize = ref(17)
const currentPage = ref(1)

onMounted(async () => {
  // @ts-ignore (define in dts)
  stockList.value = await window.api.selectAllStock(currentPage.value, pageSize.value)
  // @ts-ignore (define in dts)
  total.value = await window.api.countStock()
})

const handleSelectionChange = (val) => (multipleSelection.value = val)
const exchangeFilterHandler = (value, row) => row.exchange === value
const dataTypeFilterHandler = (value, row) => row.date_type === value

const paginationSwitch = async () => {
  if (queryKey.value !== '') {
    // @ts-ignore
    stockList.value = await window.api.blurQuery(queryKey.value, currentPage.value, pageSize.value)
  } else {
    // @ts-ignore
    stockList.value = await window.api.selectAllStock(currentPage.value, pageSize.value)
  }
}

const queryChange = async () => {
  // 重置分页为第一页
  currentPage.value = 1
  // @ts-ignore
  stockList.value = await window.api.blurQuery(queryKey.value, currentPage.value, pageSize.value)
  // @ts-ignore
  total.value = await window.api.countBlurQuery(queryKey.value)
}

// 删除
const deleteHandle = async (_index, row) => {
  const id = row.id
  const stockcode = row.stock_code
  // @ts-ignore
  const result = await window.api.deleteStock(id, stockcode)
  // @ts-ignore
  total.value = await window.api.countStock()
  paginationSwitch()
}

// 导入数据成功
const switchDialog = (flag) => {
  importDataDialog.value = flag
  paginationSwitch()
}

// 批量删除
const batchDelete = async () => {
  const idList = multipleSelection.value.map((item) => item['id'])
  const stockList = multipleSelection.value.map((item) => item['stock_code'])
  console.log(stockList)
  // @ts-ignore
  const result = await window.api.batchDelete(idList, stockList)

  // @ts-ignore
  total.value = await window.api.countStock()
  paginationSwitch()
}

// 查看
const openStockDetail = (param) => {
  // @ts-ignore
  window.api.openWindow(param.stock_code)
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
