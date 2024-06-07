<template>
  <div
    style="
      background-color: #eeeeee;
      height: 100vh;
      background-attachment: scroll;
      font-size: 2vh;
    "
  >
    <div
      style="
        background-color: #bae6fd;
        color: black;
        height: 6vh;
        font-size: 4vh;
        font-weight: 800;
        padding-bottom: 1vh;
      "
    >
      2. PALLET SCAN
      <router-link to="/">
        <font-awesome-icon
          icon="fa-solid fa-house"
          class="float-start"
          style="height: 4vh; padding: 1vh; color: black"
        />
      </router-link>
      <font-awesome-icon
        icon="fa-solid fa-rotate"
        class="float-end"
        style="height: 4vh; padding: 1vh"
        @click="refresh"
      />
    </div>

    <div class="container mt-2">
      <div class="row row-cols-auto g-3 align-items-center">
        <div class="col-6">
          <div class="input-group" @change="setDate">
            <label class="input-group-text col-4" style="font-size: 2vh"
              >Date</label
            >
            <div class="form-control">
              <span style="font-size: 2vh">{{ date }} </span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="input-group" @change="setDate">
            <label class="input-group-text col-6" style="font-size: 2vh"
              >Customer</label
            >
            <div class="form-control">
              <span style="font-size: 2vh">{{
                customer === 'S1300'
                  ? 'MAL'
                  : customer === 'S1301'
                  ? 'MGA'
                  : 'HMMA'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <i class="bi-alarm" style="font-size: 2rem; color: cornflowerblue"></i>

      <div class="music-player visually-hidden">
        <audio ref="erroraudio" src="/error.mp3" muted></audio>
        <button type="button" @click="errorSound" ref="errorbutton">
          Play Error
        </button>
        <audio ref="sucessaudio" src="/success.mp3" muted></audio>
        <button type="button" @click="successSound" ref="successbutton">
          Play Success
        </button>
        <audio ref="notiaudio" src="/noti.mp3" muted></audio>
        <button type="button" @click="notiSound" ref="notibutton">
          Play Noti
        </button>
      </div>

      <div class="input-group mt-2">
        <input
          type="text"
          placeholder="Scan Here"
          v-model="scanValue"
          class="form-control"
          @keyup.enter="barcodeChk"
          autofocus
        />
      </div>

      <div
        class="mt-2"
        v-if="summary.length > 0"
        style="height: 35vh; overflow: auto"
      >
        <div class="badge text-bg-primary">Stock Count</div>
        <div
          class="badge text-bg-light"
          style="margin-left: 5rem; cursor: pointer"
          @click="excelExport1"
        >
          Export
        </div>
        <table class="table table-hover" style="font-size: 1.5vh">
          <thead class="table-primary">
            <tr style="position: sticky; top: 0">
              <th v-for="b in headers1" :key="b">{{ b.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in summary" :key="a">
              <td v-for="c in headers1" :key="c">
                {{ a[c.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="border: solid black 2px"></div>
      <div class="mt-2" style="height: 35vh; overflow: auto">
        <div class="badge text-bg-warning">Scan List</div>
        <div
          class="badge text-bg-light"
          style="margin-left: 5rem; cursor: pointer"
          @click="excelExport2"
        >
          Export
        </div>
        <table class="table table-hover" style="font-size: 1.5vh">
          <thead class="table-warning">
            <tr style="position: sticky; top: 0">
              <th>Item No</th>
              <th>Tag No</th>
              <th>Qty</th>
              <th>Scan Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in list" :key="a">
              <td>{{ a.ITMNO }}</td>
              <td>{{ a.STAG_NO }}</td>
              <td>{{ a.TAG_QTY }}</td>
              <td>{{ a.SCAN_DTTM }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      scanValue: '',
      date: '',
      customer: '',
      input: {},
      summary: '',
      list: '',
      allchecked: true,
      containernumber: '',
      now1: 'table-warning',
      now2: 'table-secondary',
      playing: false,
      headers1: [
        { title: 'Date', key: 'SCAN_DATE' },
        { title: 'CUSTOMER', key: 'CUST_CD' },
        { title: 'Item No', key: 'ITMNO' },
        { title: 'QTY', key: 'TAG_QTY' }
      ],
      headers2: [
        { title: 'Date', key: 'SCAN_DATE' },
        { title: 'CUSTOMER', key: 'CUST_CD' },
        { title: 'Item No', key: 'ITMNO' },
        { title: 'Tag No', key: 'STAG_NO' },
        { title: 'QTY', key: 'TAG_QTY' },
        { title: 'Time', key: 'SCAN_DTTM' }
      ]
    }
  },
  setup() {},
  created() {
    this.date = this.$route.query.date
    this.customer = this.$route.query.customer
  },
  mounted() {
    if (localStorage.getItem('reloaded')) {
      // The page was just reloaded. Clear the value from local storage
      // so that it will reload the next time this page is visited.
      localStorage.removeItem('reloaded')
    } else {
      // Set a flag so that we know not to reload the page twice.
      localStorage.setItem('reloaded', '1')
      location.reload()
    }
    this.getSummary()
    this.getList()
  },
  unmounted() {},
  methods: {
    errorSound() {
      const audio = this.$refs.erroraudio
      // Unmute the audio before playing
      audio.muted = false
      // Play the audio
      audio.play()
      // Stop the audio after 1 second
      setTimeout(() => {
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
        } else {
          audio.currentTime = 0
        }
      }, 1200)
    },
    successSound() {
      const audio = this.$refs.sucessaudio
      // Unmute the audio before playing
      audio.muted = false
      // Play the audio
      audio.play()
      // Stop the audio after 1 second
      setTimeout(() => {
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
        } else {
          audio.currentTime = 0
        }
      }, 1200)
    },
    notiSound() {
      const audio = this.$refs.notiaudio
      // Unmute the audio before playing
      audio.muted = false
      // Play the audio
      audio.play()
      // Stop the audio after 1 second
      setTimeout(() => {
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
        } else {
          audio.currentTime = 0
        }
      }, 1200)
    },

    async getSummary() {
      const r = await this.$post('/api/getsummary', {
        params: { date: this.date, customer: this.customer }
      })
      console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      this.summary = r.data.recordset
    },

    async getList() {
      const r = await this.$post('/api/getlist', {
        params: { date: this.date, customer: this.customer }
      })
      if (r === undefined) {
        alert('Error at getList')
        return
      }
      console.log('getData', r)
      this.list = r.data.recordset
    },
    async chkDup(a) {
      const r = await this.$post('/api/chkdup', { params: a })
      if (r === undefined) {
        alert('Error at chkDup')
        return
      }
      console.log('chkDup', r)
      if (r.data.recordset.length === 0) {
        return false
      } else {
        return true
      }
    },
    async chkITMNO(a) {
      const r = await this.$post('/api/chkitmno', { params: a })
      if (r === undefined) {
        alert('Error at chkITMNO')
        return
      }
      console.log('chkITMNO', r)
      if (r.data.recordset.length === 0) {
        return true
      } else {
        return false
      }
    },

    async inserthist(a) {
      const r = await this.$post('/api/insertdata', { params: a })
      if (r === undefined) {
        alert('Error at inserthist')
        return
      }
      console.log('inserthist', r)
    },

    goToProduct(a, b) {
      this.$router.push({
        path: '/productscan',
        query: { ...a, ...b }
      })
    },
    goToHome() {
      this.$router.push({
        path: '/'
      })
    },
    refresh() {
      location.reload()
    },
    getDate1(a) {
      const pad2 = (n) => (n < 10 ? '0' : '') + n
      return (
        a.getFullYear() +
        '-' +
        pad2(a.getMonth() + 1) +
        '-' +
        pad2(a.getDate()) +
        ' ' +
        pad2(a.getHours()) +
        ':' +
        pad2(a.getMinutes()) +
        ':' +
        pad2(a.getSeconds())
      )
    },
    excelExport1() {
      if (this.summary === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers1, this.summary, 'Export', {})
    },
    excelExport2() {
      if (this.summary === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers2, this.list, 'Export', {})
    },

    async barcodeChk() {
      let LABEL_DATE = ''
      let LABEL_ITMNO = ''
      let LABEL_QTY = ''
      let LABEL_TAGNO = ''
      const scanValue = this.scanValue.toUpperCase()
      // const scanValue = this.scanValue.toUpperCase()
      // 날짜변환
      const today1 = this.getDate1(new Date())
      console.log('today1', today1)
      if (scanValue.slice(0, 6) === '[)>*06') {
        const datas = scanValue.split(':')
        for (const a of datas) {
          if (a.slice(0, 1) === 'P') {
            LABEL_ITMNO = a.slice(1)
            LABEL_ITMNO = LABEL_ITMNO.slice(0, 5) + '-' + LABEL_ITMNO.slice(5)
            // 아이템번호가 아이템마스터에 있는지 체크
            if (await this.chkITMNO(LABEL_ITMNO)) {
              this.$refs.errorbutton.click()
              alert('No Item - scan item is not in Item Master')
              location.reload()
              return
            }
          } else if (a.slice(0, 2) === '7Q') {
            LABEL_QTY = a.slice(2)
            LABEL_QTY = Number(LABEL_QTY)
            // Label QTY 체크
            if (!LABEL_QTY > 0) {
              this.$refs.errorbutton.click()
              alert('QTY Error - please check scan QTY is correct')
              location.reload()
              return
            }
          } else if (a.slice(0, 1) === 'D') {
            LABEL_DATE = a.slice(1)
            // 날짜변환
            if (LABEL_DATE.length === 6) {
              if (LABEL_DATE.slice(0, 2) > 12) {
                LABEL_DATE = '20' + LABEL_DATE
              } else {
                LABEL_DATE =
                  '20' + LABEL_DATE.slice(-2) + LABEL_DATE.slice(0, 4)
              }
            }
          } else if (a.slice(0, 2) === '3S') {
            LABEL_TAGNO = a.slice(2)
            console.log(LABEL_TAGNO)
            if (
              LABEL_TAGNO.slice(0, 4) !== 'KMMG' &&
              LABEL_TAGNO.slice(0, 4) !== '1102'
            ) {
              this.$refs.errorbutton.click()
              alert('Customer Error - please check pallet serno is correct')
              location.reload()
              return
            }
          }
        }
        console.log(LABEL_DATE, LABEL_ITMNO, LABEL_QTY, LABEL_TAGNO)
        // Duplicate 체크
        if (await this.chkDup(LABEL_TAGNO)) {
          this.$refs.errorbutton.click()
          alert('Duplicate - this pallet is already scanned')
          location.reload()
          return
        }

        await this.inserthist({
          date: this.date,
          customer: this.customer,
          itmno: LABEL_ITMNO,
          qty: LABEL_QTY,
          tagno: LABEL_TAGNO,
          time: today1
        })
        this.$refs.successbutton.click()
        setTimeout(() => {
          location.reload()
        }, 1200)
      } else {
        this.$refs.errorbutton.click()
        alert('Label Error - please check pallet label format')
        console.log('no', this.scanValue.slice(0, 7))
        location.reload()
      }
    }
  }
}
</script>
<style scoped>
input:focus {
  background: yellow;
}
</style>
