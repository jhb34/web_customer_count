import axios from 'axios'

axios.defaults.baseURL = 'http://172.20.2.122:3000'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.defaults.withCredentials = true

export default {
  methods: {
    async $get(url) {
      return (
        await axios.get(url).catch((e) => {
          console.log(e)
        })
      ).data
    },
    async $post(url, data) {
      return await axios.post(url, data).catch((e) => {
        console.log(e)
      })
    },
    async $put(url, data) {
      return await axios.put(url, data).catch((e) => {
        console.log(e)
      })
    },
    async $delete(url) {
      return await axios.delete(url).catch((e) => {
        console.log(e)
      })
    },
    async $upload(url, file) {
      const formData = new FormData()
      return await axios
        .post(url, formData, {
          headers: { 'Content-Type': 'mutipart/form-data' }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
