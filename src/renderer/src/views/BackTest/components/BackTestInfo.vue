<template>
  <div class="h-[100%] border-solid border-l-[1px] border-[#e5e7eb] px-[24px]">
    <table class="text-[14px] w-[182px] my-[24px] text-center h-[272px]">
      <tbody align="left">
        <tr>
          <td>策略名称：</td>
          <td>{{ backDetail.bt_strategy_name }}</td>
        </tr>
        <tr>
          <td>回测类型：</td>
          <td>{{ backDetail.bt_back_type }}</td>
        </tr>
        <tr>
          <td>回测周期：</td>
          <td>{{ backDetail.bt_preiod }}</td>
        </tr>
        <tr>
          <td>初始资金：</td>
          <td>{{ backDetail.bt_initial_capital }}</td>
        </tr>
        <tr>
          <td>开始日期：</td>
          <td>{{ backDetail.bt_start_date }}</td>
        </tr>
        <tr>
          <td>结束日期：</td>
          <td>{{ backDetail.bt_end_date }}</td>
        </tr>
        <tr>
          <td>最大盈利：</td>
          <td>{{ backDetail.bt_max_profit }}</td>
        </tr>
        <tr>
          <td>最大亏损：</td>
          <td class="text-[green]">{{ backDetail.bt_max_loss }}</td>
        </tr>
        <tr>
          <td>结束资金：</td>
          <td>{{ backDetail.bt_end_capital }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['backDetail'])
console.log(props.backDetail)
</script>

<style scoped lang="scss">
tr {
  @apply mb-[24px];
}
tr td:first-of-type {
  @apply w-[72px] font-[900];
}
</style>
