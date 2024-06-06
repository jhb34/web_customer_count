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
        font-weight: 800;
        font-size: 4vh;
        padding-bottom: 1vh;
      "
    >
      1. Customer Stock Count
      <font-awesome-icon
        icon="fa-solid fa-rotate"
        class="float-end"
        style="height: 4vh; padding: 1vh"
        @click="refresh"
      />
    </div>
    <div class="container">
      <div class="input-group mt-2" @change="setDate">
        <span class="input-group-text col-3" style="font-size: 2vh">Date</span>
        <input
          type="date"
          v-model="dateValue"
          style="font-size: 2vh"
          class="form-control"
        />
      </div>
      <div class="input-group mt-2">
        <span class="input-group-text col-3 text-center" style="font-size: 2vh"
          >Customer</span
        >
        <select
          class="form-select"
          id="inlineFormSelectPref"
          style="font-size: 2vh"
          v-model="customer"
        >
          <option value="">Choose Customer</option>
          <option value="S1300">MAL</option>
          <option value="S1301">MGA</option>
          <option value="S0800">HMMA</option>
        </select>
      </div>

      {{ dateValue }}
      {{ date }}
      {{ customer }}
      <div class="music-player visually-hidden">
        <audio ref="erroraudio" src="/error.mp3" muted></audio>
        <audio ref="sucessaudio" src="/success.mp3" muted></audio>
        <button type="button" @click="errorSound" ref="errorbutton">
          Play Error
        </button>
        <button type="button" @click="successSound" ref="successbutton">
          Play Success
        </button>
      </div>
      <div class="input-group mt-2">
        <button
          type="button"
          class="btn btn-primary col-3"
          style="font-size: 2vh"
          @click="getSummary"
        >
          Search
        </button>
      </div>
      <div
        class="mt-2"
        v-if="summary.length > 0"
        style="height: 65vh; overflow: auto"
      >
        <table class="table table-hover">
          <thead class="table-dark">
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
        <p>To continue scanning, please press the following button.</p>
        <button @click="goToScan" class="btn btn-danger">Scan</button>
      </div>
    </div>
  </div>
</template>
<script>
// import { Howl } from 'howler'
export default {
  components: {},
  data() {
    return {
      dateValue: new Date().toISOString().slice(0, 10),
      summary: '',
      customer: '',
      data: '',
      playing: false,
      headers1: [
        { title: 'Date', key: 'SCAN_DATE' },
        { title: 'CUSTOMER', key: 'CUST_CD' },
        { title: 'Item No', key: 'ITMNO' },
        { title: 'QTY', key: 'TAG_QTY' }
      ]
    }
  },
  setup() {},
  created() {},
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
    this.setDate()
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
    setDate() {
      let a = ''
      a = this.dateValue.split('-')
      a = a.join('')
      this.date = a
    },
    async getSummary() {
      if (this.date === '' || this.customer === '') {
        this.$refs.errorbutton.click()
        alert('Please select Date')
      } else {
        const r = await this.$post('/api/getsummary', {
          params: { date: this.date, customer: this.customer }
        })
        console.log(r)
        if (r === undefined) {
          alert('Error at getData')
          return
        }
        this.summary = r.data.recordset
        if (this.summary.length === 0) {
          this.goToScan()
        }
      }
    },
    refresh() {
      location.reload()
    },
    goToScan() {
      this.$router.push({
        path: '/palletscan',
        query: { date: this.date, customer: this.customer }
      })
    }
  }
}
</script>
