<template>
  <codemirror
    :modelValue="code"
    placeholder="Code goes here..."
    :style="{ height: '100vh', width: '100%' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="changeHandle($event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>

<script>
import { defineComponent, ref, shallowRef, defineEmits } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default defineComponent({
  components: {
    Codemirror
  },
  props: ['code'],
  setup() {
    const emits = defineEmits(['update:code'])
    const extensions = [javascript()]

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

    const changeHandle = (event) => {
      emits('update:code', event)
    }

    return {
      extensions,
      handleReady,
      log: console.log,
      changeHandle
    }
  }
})
</script>
