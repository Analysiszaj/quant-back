<template>
  <div class="py-[12px] px-[8px]">
    <div class="bg-[white] h-[100%] relative">
      <div class="absolute w-[100%] h-[100%]">
        <el-table :data="backTestList" border style="width: 100%" table-layout="auto">
          <el-table-column prop="bt_id" label="策略id" min-width="150" align="center" />
          <el-table-column
            prop="bt_strategy_name"
            label="策略名称"
            min-width="150"
            align="center"
          />
          <el-table-column prop="bt_back_type" label="回测类型" min-width="150" align="center" />
          <el-table-column prop="bt_preiod" label="回测周期" min-width="150" align="center" />
          <el-table-column
            prop="bt_initial_capital"
            label="初始资金"
            min-width="150"
            align="center"
          />
          <el-table-column prop="bt_start_date" label="开始日期" min-width="150" align="center" />
          <el-table-column prop="bt_end_date" label="结束日期" min-width="150" align="center" />
          <el-table-column prop="bt_max_profit" label="最大盈利" min-width="150" align="center" />
          <el-table-column prop="bt_max_loss" label="最大亏损" min-width="150" align="center" />
          <el-table-column prop="bt_end_capital" label="结束资金" min-width="150" align="center" />
          <el-table-column label="操作" width="210" align="center">
            <template #default="scope">
              <el-button size="small" @click="openBackTestDetail(scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="deleteHandle(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="absolute right-[12px] bottom-[12px]"
          background
          layout="prev, pager, next"
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          :total="total"
          @current-change="paginationSwitch"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
const backTestList = ref([])
const total = ref(100)
const pageSize = ref(18)
const currentPage = ref(1)

onMounted(async () => {
  // @ts-ignore
  backTestList.value = await window.api.queryAllBackTest(currentPage.value, pageSize.value)
  // @ts-ignore
  total.value = await window.api.queryBackTestNum()
})

const deleteHandle = async (_index, row) => {
  // @ts-ignore
  const resDel = await window.api.deleteBackTestDetail(row.bt_id)

  if (resDel === '删除成功') {
    ElMessage.success(resDel)
  } else {
    ElMessage.error(resDel)
  }

  // 刷新页面
  // @ts-ignore
  backTestList.value = await window.api.queryAllBackTest(currentPage.value, pageSize.value)
  // @ts-ignore
  total.value = await window.api.queryBackTestNum()
}
const openBackTestDetail = (row) => {
  console.log(row)
}

const paginationSwitch = async () => {
  // @ts-ignore
  backTestList.value = await window.api.queryAllBackTest(currentPage.value, pageSize.value)
  // @ts-ignore
  total.value = await window.api.queryBackTestNum()
  console.log(total)
}
</script>

<style scoped></style>
