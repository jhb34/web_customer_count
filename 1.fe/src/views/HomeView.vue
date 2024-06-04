<template>
  <div>
    <button @click="getline">button</button>
    <p>{{ lines }}</p>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      lines: ''
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    async getline() {
      const r = await this.$get('/api/getlines')
      console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      this.lines = r.recordset
    }
  }
}
</script>
