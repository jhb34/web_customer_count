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
      Customer Stock Count
    </div>

    <div class="container mt-2">
      <div class="row row-cols-auto g-3 align-items-center">
        <div class="col-5">
          <div class="input-group" @change="setDate">
            <label class="input-group-text col-3" style="font-size: 1.5vh"
              >Date</label
            >
            <input
              type="date"
              v-model="dateValue"
              style="font-size: 1.5vh"
              class="form-control"
            />
          </div>
        </div>

        <div class="col-7">
          <div class="input-group" @change="setDate">
            <label
              class="input-group-text col-4"
              for="inlineFormSelectPref"
              style="font-size: 1.5vh"
              >Customer</label
            >
            <select
              class="form-select"
              id="inlineFormSelectPref"
              style="font-size: 1.5vh"
              v-model="customer"
            >
              <option value="">Choose...</option>
              <option value="S1300">MAL</option>
              <option value="S1301">MGA</option>
              <option value="S0800">HMMA</option>
            </select>
            <button class="btn btn-primary" style="font-size: 1.5vh">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container input-group">
      <!-- <div class="music-player visually-hidden">
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
      </div> -->

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

      <div class="mt-2" style="height: 65vh; overflow: auto">
        <table class="table table-hover">
          <thead class="table-dark">
            <tr style="position: sticky; top: 0">
              <th>ASN</th>
              <th>Item</th>
              <th>Status</th>
              <th>Order</th>
              <th>Scan</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="a in data"
              :key="a"
              :class="[
                a.NOW_ST === '1' ? now1 : a.NOW_ST === '0' ? null : now2
              ]"
            >
              <td>{{ a.ASN_NO.slice(0, -10) }}</td>
              <td>{{ a.ITMNO }}</td>
              <td>
                <span
                  v-if="a.NOW_ST === '1'"
                  class="badge rounded-pill text-bg-warning"
                  >Scanning</span
                >
                <span
                  v-else-if="a.NOW_ST === '0'"
                  class="badge rounded-pill text-bg-light"
                  >Waiting</span
                >
                <span v-else class="badge rounded-pill text-bg-secondary"
                  >Done</span
                >
              </td>
              <td>{{ a.ORD_BOX }}</td>
              <td>{{ a.SCAN_BOX }}</td>
              <td>{{ a.SCAN_HM.substring(10, 19) }}</td>
              <!-- <td>
                <span v-if="a.NOW_ST === '0'" class="badge bg-warning text-dark"
                  >Ready</span
                >
                <span
                  v-else-if="a.NOW_ST === a.ORD_BOX"
                  class="badge text-bg-danger"
                  >Scanning</span
                >
                <span v-else class="badge text-bg-secondary">Complete</span>
              </td> -->
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
      dateValue: new Date().toISOString().slice(0, 10),
      customer: '',
      data: '',
      playing: false
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
    async chkst() {
      this.data.forEach((a) => {
        if (a.NOW_ST !== '2') {
          this.allchecked = false
        }
      })
    },
    async savecontainer() {
      if (this.containernumber === '') {
        this.$refs.errorbutton.click()
        alert('Please input container number')
        return
      }
      const yes = confirm('Do you want to save container number?')
      if (yes) {
        await this.updatecontainer()
      }
    },
    async getData() {
      const r = await this.$post('/api/palletscan/getlist', {
        params: [this.input.date, this.input.trail, this.input.cust]
      })
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      console.log('getData', r)
      this.data = r.data.recordset
      await this.chkst()
    },
    async chkDup(a) {
      const r = await this.$post('/api/palletscan/chkdup', { params: a })
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
    async chkPO(a) {
      const r = await this.$post('/api/palletscan/chkpo', { params: a })
      if (r === undefined) {
        alert('Error at chkPO')
        return
      }
      console.log('chkPO', r)
      if (r.data.recordset.length === 0) {
        return true
      } else {
        return false
      }
    },
    async chkITMNO(a) {
      const r = await this.$post('/api/palletscan/chkitmno', { params: a })
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
    async isShaft(a) {
      const r = await this.$post('/api/palletscan/isshaft', { params: a })
      if (r === undefined) {
        alert('Error at isShaft')
        return
      }
      console.log('isshaft', r)
      if (r.data.recordset.length > 0) {
        return true
      } else {
        return false
      }
    },
    async inserthist(a) {
      const r = await this.$post('/api/inserthist', { params: a })
      if (r === undefined) {
        alert('Error at inserthist')
        return
      }
      console.log('inserthist', r)
    },
    async updateorder(a) {
      const r = await this.$post('/api/updateorder', { params: a })
      if (r === undefined) {
        alert('Error at updateorder')
        return
      }
      console.log('updateorder', r)
    },
    async updateprdtag(a) {
      const r = await this.$post('/api/updateprdtag', { params: a })
      if (r === undefined) {
        alert('Error at updateprdtag')
        return
      }
      console.log('updateprdtag', r)
    },
    async updatecontainer() {
      const con = this.containernumber.trim()
      const r = await this.$post('/api/palletscan/updatecontainer', {
        params: [con, this.input]
      })
      if (r === undefined) {
        alert('Error at updatecontainer')
        return
      }
      console.log('updatecontainer', r)
      if (r.status === 200) {
        this.$refs.successbutton.click()
        alert('Container number saved')
        this.goToHome()
      }
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
        pad2(a.getMonth() + 1) +
        pad2(a.getDate()) +
        pad2(a.getHours()) +
        pad2(a.getMinutes()) +
        pad2(a.getSeconds())
      )
    },
    getDate3(a) {
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
    getDate2(a) {
      return (
        25567.0 +
        (a.getTime() - a.getTimezoneOffset() * 60 * 1000) /
          (1000 * 60 * 60 * 24)
      )
    },
    async barcodeChk() {
      let TMP_DATE = ''
      let TMP_ITMNO = ''
      let TMP_QTY = ''
      let TMP_SERNO = ''
      let TMP_CUST = ''
      const scanValue = this.scanValue.toUpperCase()
      // const scanValue = this.scanValue.toUpperCase()
      const tempData = {}
      // 날짜변환
      const today1 = this.getDate1(new Date())
      const today2 = this.getDate2(new Date())
      const today3 = this.getDate3(new Date())
      console.log('today1', today1)
      console.log('today2', today2)
      console.log('today3', today3)
      if (scanValue.slice(0, 6) === '[)>*06') {
        const datas = scanValue.split(':')
        for (const a of datas) {
          if (a.slice(0, 1) === 'P') {
            TMP_ITMNO = a.slice(1)
            TMP_ITMNO = TMP_ITMNO.slice(0, 5) + '-' + TMP_ITMNO.slice(5)
            // 아이템번호가 아이템마스터에 있는지 체크
            if (await this.chkITMNO(TMP_ITMNO)) {
              this.$refs.errorbutton.click()
              alert('No Item - scan item is not in Item Master')
              location.reload()
              return
            }
          } else if (a.slice(0, 2) === '7Q') {
            TMP_QTY = a.slice(2)
            TMP_QTY = Number(TMP_QTY)
            // Label QTY 체크
            if (!TMP_QTY > 0) {
              this.$refs.errorbutton.click()
              alert('QTY Error - please check scan QTY is correct')
              location.reload()
              return
            }
          } else if (a.slice(0, 1) === 'D') {
            TMP_DATE = a.slice(1)
            // 날짜변환
            if (TMP_DATE.length === 6) {
              if (TMP_DATE.slice(0, 2) > 12) {
                TMP_DATE = '20' + TMP_DATE
              } else {
                TMP_DATE = '20' + TMP_DATE.slice(-2) + TMP_DATE.slice(0, 4)
              }
            }
          } else if (a.slice(0, 2) === '3S') {
            TMP_SERNO = a.slice(2)
            if (TMP_SERNO.slice(0, 4) === 'KMMG') {
              TMP_CUST = 'S1301'
            } else if (TMP_SERNO.slice(0, 4) === '1102') {
              TMP_CUST = 'S1300'
            } else {
              this.$refs.errorbutton.click()
              alert('Customer Error - please check pallet serno is correct')
              location.reload()
              return
            }
          }
        }
        // 스캔데이터를 tempData에 저장
        tempData.TMP_DATE = TMP_DATE
        tempData.TMP_ITMNO = TMP_ITMNO
        tempData.TMP_QTY = TMP_QTY
        tempData.TMP_SERNO = TMP_SERNO
        tempData.TMP_CUST = TMP_CUST
        console.log('scandata parsing:', datas)
        console.log('scandata', tempData)
        let selectedData = this.data.filter((a) => a.ITMNO === TMP_ITMNO)
        console.log('list data', selectedData)
        // 스캔아이템 번호가 쉬핑오더 리스트에 있는지 체크
        if (selectedData.length === 0) {
          this.$refs.errorbutton.click()
          alert('Not in List - scan Item does not match with Shipping Order')
          location.reload()
          return
        }
        // 리스트 데이터를 selectedData에 저장
        selectedData = selectedData[0]
        console.log('ASNnumber', selectedData.ASN_NO)
        // Overcharge 체크
        if (selectedData.ORD_QTY < selectedData.SCAN_QTY + tempData.TMP_QTY) {
          await this.inserthist([selectedData, tempData, today1, today2, 2])
          this.$refs.errorbutton.click()
          alert('Over Charge - please check Scan QTY')
          location.reload()
          return
        }
        // ASN No 체크
        if (selectedData.ASN_NO === '') {
          await this.inserthist([selectedData, tempData, today1, today2, 3])
          this.$refs.errorbutton.click()
          alert('NO ASN - please check Shipping Order')
          location.reload()
          return
        }
        // Duplicate 체크
        if (await this.chkDup(tempData.TMP_SERNO)) {
          await this.inserthist([selectedData, tempData, today1, today2, 4])
          this.$refs.errorbutton.click()
          alert('Duplicate - this pallet is already scanned')
          location.reload()
          return
        }
        // Customer 체크
        if (selectedData.CUST_CD !== tempData.TMP_CUST) {
          await this.inserthist([selectedData, tempData, today1, today2, 5])
          this.$refs.errorbutton.click()
          alert('Customer not match')
          location.reload()
          return
        }
        // 고객사PO 체크
        if (await this.chkPO(selectedData)) {
          await this.inserthist([selectedData, tempData, today1, today2, 7])
          this.$refs.errorbutton.click()
          alert('PO not match')
          location.reload()
          return
        }
        // 제품바코드 체크
        if (await this.isShaft([tempData, 'A'])) {
          this.$refs.notibutton.click()
          setTimeout(() => {
            this.goToProduct(selectedData, tempData)
          }, 1200)
          return
        }
        await this.inserthist([selectedData, tempData, today1, today2, 1])
        await this.updateprdtag([tempData.TMP_SERNO, today1])
        if (selectedData.ORD_QTY > selectedData.SCAN_QTY + tempData.TMP_QTY) {
          await this.updateorder([
            selectedData,
            selectedData.SCAN_QTY + tempData.TMP_QTY,
            selectedData.SCAN_BOX + 1,
            today3,
            1
          ])
          this.$refs.successbutton.click()
          setTimeout(() => {
            location.reload()
          }, 1200)
        } else if (
          selectedData.ORD_QTY ===
          selectedData.SCAN_QTY + tempData.TMP_QTY
        ) {
          await this.updateorder([
            selectedData,
            selectedData.SCAN_QTY + tempData.TMP_QTY,
            selectedData.SCAN_BOX + 1,
            today3,
            2
          ])
        }
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
