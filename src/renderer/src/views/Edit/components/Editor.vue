<template>
  <codemirror
    :modelValue="code"
    placeholder="Code goes here..."
    :style="{ height: '100vh', width: '100%' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @change="changeHandle($event)"
    @ready="handleReady"
    @blur="blurHandle($event)"
  />
</template>

<script>
import { defineComponent, ref, shallowRef, defineEmits, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default defineComponent({
  components: {
    Codemirror
  },
  props: ['code', 'selectFilePath'],
  setup(props) {
    const extensions = [javascript()]
    const newCode = ref(props.code)

    watch(
      () => props.code,
      (nValue, oValue) => {
        newCode.value = nValue
      }
    )

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }

    // Status is available at all times via Codemirror EditorView
    const getCodemirrorStates = () => {
      const state = view.value.state
      const ranges = state.selection.ranges
      const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
      const cursor = ranges[0].anchor
      const length = state.doc.length
      const lines = state.doc.lines
    }

    const blurHandle = async (event) => {
      const saveReuslt = await window.api.strategySave(
        props.selectFilePath.split('.')[0],
        newCode.value
      )
      console.log(saveReuslt)
    }
    const changeHandle = (event) => {
      newCode.value = event
    }
    return {
      extensions,
      handleReady,
      log: console.log,
      blurHandle,
      changeHandle
    }
  }
})
</script>
