<template>
  <div style="color: black">
    <h4>从CSV文件中导入数据</h4>
    <table>
      <tbody>
        <tr>
          <td><el-button @click="selectFile" size="small">选择文件</el-button></td>
          <td><el-input type="text" v-model="form.filePath" size="small" /></td>
        </tr>
        <tr>
          <td colspan="2" class="file-form-height">合约信息</td>
        </tr>
        <tr>
          <td>代码</td>
          <td><el-input type="text" v-model="form.stockCode" /></td>
        </tr>
        <tr>
          <td>交易所</td>
          <td>
            <el-select v-model="form.exchange" class="m-2" placeholder="SH">
              <el-option
                v-for="(item, key) in enumExchange"
                :key="key"
                :label="item"
                :value="item"
              />
            </el-select>
          </td>
        </tr>
        <tr>
          <td>周期</td>
          <td>
            <el-select v-model="form.dateType" class="m-2" placeholder="小时">
              <el-option v-for="(item, key) in period" :key="key" :label="item" :value="item" />
            </el-select>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="file-form-height">表头信息</td>
        </tr>
        <tr v-for="(item, key) in enumTableHeader" :key="key">
          <td>{{ item.tilte }}</td>
          <el-input
            :placeholder="form['tableHeader'][item.objKeyName]"
            v-model="form['tableHeader'][item.objKeyName]"
          ></el-input>
        </tr>
        <tr>
          <td colspan="2" class="file-form-height">格式信息</td>
        </tr>
        <tr>
          <td>时间格式</td>
          <td><el-input type="text" v-model="form.dateFormat" :placeholder="form.dateFormat" /></td>
        </tr>

        <tr>
          <td colspan="2">
            <div class="file-btn" @click="submitFileKey">导入数据</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, toRaw } from 'vue'
const enumExchange = ['SH', 'SZ']
const period = ['小时', '日', '周']

const form = reactive({
  filePath: '',
  stockCode: '',
  exchange: '',
  dateType: '小时',
  tableHeader: {
    dateHeader: 'date',
    openHeader: 'open',
    highHeader: 'high',
    lowHeader: 'low',
    closeHeader: 'close',
    volumeHeader: 'volume',
    turnoverHeader: 'turnover'
  },
  dateFormat: 'YYYY-mm-dd HH:MM:SS'
})

const enumTableHeader = [
  {
    tilte: '时间戳',
    objKeyName: 'dateHeader'
  },
  {
    tilte: '开盘价',
    objKeyName: 'openHeader'
  },
  {
    tilte: '最高价',
    objKeyName: 'highHeader'
  },
  {
    tilte: '最低价',
    objKeyName: 'lowHeader'
  },
  {
    tilte: '收盘价',
    objKeyName: 'closeHeader'
  },
  {
    tilte: '成交量',
    objKeyName: 'volumeHeader'
  },
  {
    tilte: '成交额',
    objKeyName: 'turnoverHeader'
  }
]

const selectFile = async () => {
  const path = await window.electron.ipcRenderer.invoke('selectFile')
  form.filePath = path[0]

  // 从选择的文件名自动识别股票代码和市场
  const temp = form.filePath.split('\\')
  const stockFileName = temp[temp.length - 1]

  const exSh = RegExp('(600|601|603|000|002|001)[0-9]{3,3}', 'g')

  if (exSh.test(stockFileName)) {
    form.stockCode = stockFileName.split('.')[0].replace(/A-Za-z/g, '')
    form.exchange = stockFileName.split('.')[0].replace(/[0-9]/g, '')
  }
}

const emits = defineEmits(['switchDialog'])

const submitFileKey = async () => {
  const result = await window.electron.ipcRenderer.invoke('importData', toRaw(form))
  console.log(result)

  if (result === '导入数据成功') {
    emits('switchDialog', false)
  } else {
    ElMessage.error(result)
  }
}
</script>

<style scoped>
h4 {
  margin-bottom: 20px;
}
.file-form-height {
  text-align: center;
  height: 32px;
  font-size: 14px;
}

.file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 100%;
  margin-top: 32px;
  font-size: 16px;
  border-radius: 4px;
  color: white;
  background-color: #0089ba;
  cursor: pointer;
}
</style>
