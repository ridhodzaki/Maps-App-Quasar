<template>
  <div id="map" ref="map" :style="`width: 100%; height: ${this.$q.screen.height - 70}px; z-index: 2`">
  </div>
  <div v-if="false" class="absolute-top" style="z-index: 2; padding-left: 70px; padding-top: 30px; padding-right: 30px; width: 100%">
    <div class="column">
      <div class="row justify-between">
        <div class="col-10">
          <div class="bg-white" style="width: 100%">
            <q-input outlined @keyup.enter="searchLocation" :loading="loadingState" class="text-grey-10 q-pa-sm" style="border-radius: 5px; background: #FFF; padding: 0.1px" dense v-model="search" placeholder="Search">
              <template v-slot:append>
                <q-btn v-if="search.length > 0" @click="search = ''" icon="close" flat dense/>
                <q-icon v-else name="search" flat dense/>
              </template>
            </q-input>
            <q-list class="absolute-top" :style="`z-index: 3; margin-top: 70px; margin-left: 30px; width: 64%`">
              <template v-for="(result, i) in searchResults" :key="i">
                <q-item @click="centerMap(result)" clickable v-ripple class="bg-white">
                  <q-item-section avatar>
                    <q-icon color="grey-10" name="mdi-map-marker" />
                  </q-item-section>

                  <q-item-section><span class="text-weight-bold text-body"> {{ result.name }} </span> <span>{{ result.display_name }}</span></q-item-section>
                </q-item>
              </template>
            </q-list>
          </div>
        </div>
        <div class="col q-pl-sm">
          <q-btn color="white" :loading="isLoading" class="q-ma-xs" @click="getLocation" text-color="grey-9" dense icon="mdi-near-me">
            <q-tooltip transition-show="flip-right" transition-hide="flip-left" anchor="top middle" self="center middle">
              Find My Location
            </q-tooltip>
          </q-btn>
          <q-btn color="white" class="q-ma-xs" @click="dialoglistPolygon = !dialoglistPolygon" text-color="grey-9" dense icon="mdi-text-box-multiple-outline">
            <q-tooltip transition-show="flip-right" transition-hide="flip-left" anchor="top middle" self="center middle">
              List Polygon
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute-bottom" :style="`z-index: 2; padding-left: 30px; padding-right: 30px; padding-bottom: 30px; width: ${this.$q.screen.width/3}px`">
      <div class="row">
        <div class="col-auto q-pa-xs">
          <div class="column" >
            <div class="q-mb-sm bg-white" style="border-radius: 5px;">
              <div class="col-auto q-pa-xs">
                <q-btn color="white" :disable="isDrawing" @click="startDrawing" text-color="grey-9" dense icon="mdi-shape-polygon-plus">
                  <q-tooltip v-if="!isDrawing" transition-show="flip-right" transition-hide="flip-left" anchor="center right" self="center left">
                    Create Polygon
                  </q-tooltip>
                </q-btn>
                <q-btn label="Buat Polygon" @click="startMake" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-auto q-pa-xs absolute" v-if="isDrawing" style="margin-top: -50px">
          <div class="row" style="border-radius: 5px; width: 100%; margin-left: -10px">
            <div class="col q-pa-xs">
              <q-btn color="white" @click="finishDrawing" text-color="grey-9" dense label="Finish" no-caps />
            </div>
            <div class="col q-pa-xs">
              <q-btn color="white" @click="cancelPolygon" text-color="grey-9" dense label="Cancel" no-caps />
            </div>
          </div>
        </div>
    </div>
  </div>
  <div v-if="isDetailOpen" class="absolute-top-right" :style="`z-index: 2; padding-left: 30px; padding-top: 70px; padding-right: 30px; width: ${this.$q.screen.xs ? this.$q.screen.width :this.$q.screen.width / 3}px`">
    <div class="q-pa-md bg-white q-ma-sm" style="border-radius: 5px">
      <div class="column">
        <div class="row justify-between q-mb-lg">
          <div class="col-auto">
            <span class="text-h5 text-weight-medium">Detail Tanah</span>
          </div>
          <div class="col-auto">
            <q-btn icon="close" @click="closeSelectPolygon" flat dense/>
          </div>
        </div>
        <table>
          <tr>
            <td>Nama Pemilik</td>
            <td> {{ activeData.owner }} </td>
          </tr>
          <tr>
            <td>Isi Lahan</td>
            <td> {{ activeData.landUse }} </td>
          </tr>
          <tr>
            <td>Jenis Lahan</td>
            <td> {{ activeData.landType }} </td>
          </tr>
          <tr>
            <td>Ukuran Lahan</td>
            <td> {{ activeData.landSize }} </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <q-dialog v-model="dialogSave" position="right" full-width persistent >
    <div class="bg-white q-pa-md" >
      <div class="row justify-between q-mb-lg">
        <div class="col-auto">
          <span class="text-h5">Data Tanah</span>
        </div>
        <div class="col-auto">
          <q-btn icon="close" flat dense @click="cancelPolygon"/>
        </div>
      </div>
      <q-form class="q-gutter-sm">
        <q-input outlined v-model="polygonData.owner" label="Nama Pemilik" :style="`width: ${this.$q.screen.width - 300}px`"></q-input>
        <q-input outlined v-model="polygonData.landUse" label="Isi Lahan"></q-input>
        <q-input outlined v-model="polygonData.landType" label="Jenis Lahan"></q-input>
        <q-input outlined v-model="polygonData.landSize" label="Ukuran Lahan"></q-input>
        <div class="row q-gutter-sm justify-end">
          <q-btn label="Simpan" no-caps color="primary" @click="savePolygon"></q-btn>
          <q-btn label="Batal" no-caps color="negative" @click="cancelPolygon"></q-btn>
        </div>
      </q-form>
    </div>
  </q-dialog>
  <q-dialog v-model="dialoglistPolygon" position="right" full-width persistent>
    <div class="bg-white q-pa-md">
      <div class="row justify-between q-mb-lg">
        <div class="col-auto">
          <span class="text-h5">List Polygon</span>
        </div>
        <div class="col-auto">
          <q-btn v-close-popup icon="close" flat dense/>
        </div>
      </div>
      <q-list>
        <template v-for="(polygon, i) in polygons" :key="i">
          <q-item class="column" clickable>
            <span>{{ polygon.dataLahan }}</span>
            <span class="text-body1">Nama Pemilik : {{ polygon.dataLahan.owner }}</span>
            <span>Nama Pemilik : </span>
            <span>Nama Pemilik : </span>
          </q-item>
        </template>
      </q-list>
    </div>
  </q-dialog>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

export default {
  name: 'MapLeaflet',
  data () {
    return {
      search: '',
      searchResults: [],
      lat: -4.958634,
      lng: 104.945778,
      zoom: 8,
      map: null,
      isDrawing: false,
      loadingState: false,
      isLoading: false,
      polygons: [],
      markers: [],
      dialogSave: false,
      dialogDetail: false,
      dialoglistPolygon: false,
      activeData: null,
      isDetailOpen: false,
      polygonData: {
        owner: '',
        landUse: '',
        landType: '',
        landSize: ''
      }
    }
  },
  mounted () {
    this.initializeMap()
  },
  methods: {
    initializeMap () {
      this.map = L.map('map', {
        zoomControl: false,
        zoomSnap: 0.25
      }).setView([this.lat, this.lng], this.zoom)

      this.drawnItems = new L.FeatureGroup()
      this.map.addLayer(this.drawnItems)

      L.control.zoom({
        position: 'bottomright' // Mengatur posisi ke kanan bawah
      }).addTo(this.map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      }).addTo(this.map)
    },
    async searchLocation () {
      this.loadingState = true
      setTimeout(
        await this.$axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: this.search,
            format: 'json'
          }
        }).finally(() => {
          this.loadingState = false
        }).then((res) => {
          console.log(res)
          this.searchResults = res.data
        }).catch((err) => {
          console.log(err)
        }), 2000
      )
    },
    getLocation () {
      this.isLoading = true

      if ('geolocation' in navigator) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }

        // Fungsi rekursif untuk terus mencoba mendapatkan lokasi
        const recursiveGetLocation = () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // console.log(this.currentMarker)
              this.lat = position.coords.latitude
              this.lng = position.coords.longitude
              // console.log(position)

              // Periksa akurasi, jika lebih dari 30, panggil getLocation kembali
              if (position.coords.accuracy >= 30) {
                recursiveGetLocation() // Coba lagi
              } else {
                // Hapus marker dan circle marker yang ada di lokasi lama
                if (this.currentMarker) {
                  this.map.removeLayer(this.currentMarker)
                }
                if (this.currentCircleMarker) {
                  this.map.removeLayer(this.currentCircleMarker)
                }
                // Tambahkan marker baru di lokasi baru
                this.currentMarker = L.marker([this.lat, this.lng]).addTo(this.map)
                this.currentCircleMarker = L.circleMarker([this.lat, this.lng], {
                  radius: position.coords.accuracy,
                  color: '#00ffff',
                  opacity: 0.75
                }).addTo(this.map)

                this.isLoading = false
                // Tetap atur tampilan peta, bahkan jika tidak membuat marker baru
                this.map.setView([this.lat, this.lng], 20)
              }
            },
            (error) => {
              console.error('Error getting location:', error)
              this.isLoading = false
              this.$q.notify({
                message: 'Gagal Mendapatkan Lokasi, Coba lagi nanti',
                color: 'negative'
              })
            },
            options
          )
        }

        // Mulai mencoba mendapatkan lokasi
        recursiveGetLocation()
      } else {
        console.error('Geolocation is not available in this browser.')
        this.isLoading = false
      }
    },
    centerMap (result) {
      this.search = `${result.name}. ${result.display_name}`
      this.searchResults = []
      this.lat = result.lat
      this.lng = result.lon
      this.map.setView([this.lat, this.lng], 16)
    },
    startDrawing () {
      this.isDrawing = true
      const polygon = L.polygon([], { color: 'red', weight: 1 }).addTo(this.map)
      this.polygons.push(polygon)
      console.log(this.polygons)
      polygon.on('click', this.onPolygonClick)
      this.map.on('click', function (e) {
        const latlng = e.latlng
        polygon.addLatLng(latlng)
      })
    },
    finishDrawing () {
      this.isDrawing = false
      this.map.off('click')
      this.dialogSave = true
    },
    onPolygonClick (e) {
      console.log(e)
      if (this.currentYellowPolygon) {
        this.currentYellowPolygon.setStyle({ color: 'red' })
      }

      // Menyimpan polygon yang saat ini dalam keadaan kuning
      this.currentYellowPolygon = e.target
      e.target.setStyle({ color: 'yellow' })
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker)
      }

      if (this.currentCircleMarker) {
        this.map.removeLayer(this.currentCircleMarker)
      }
      this.activeData = e.target.dataLahan
      this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map)
      this.map.setView([e.latlng.lat, e.latlng.lng])
      // Menampilkan dialog ketika polygon diklik
      // this.dialogDetail = true
      this.isDetailOpen = true
    },
    resetPolygonData () {
      // Mengatur ulang data polygon
      this.polygonData = {
        owner: '',
        landUse: '',
        landType: '',
        landSize: ''
      }
    },
    savePolygon () {
      this.polygons[this.polygons.length - 1].dataLahan = this.polygonData
      this.map.addLayer(this.polygons[this.polygons.length - 1])
      this.isDrawing = false
      this.dialogSave = false
      this.resetPolygonData()
      console.log(this.polygons)
    },
    closeSelectPolygon () {
      if (this.currentYellowPolygon) {
        this.currentYellowPolygon.setStyle({ color: 'red' })
      }
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker)
      }
      this.isDetailOpen = false
    },
    cancelPolygon () {
      // Membatalkan menggambar polygon dan menutup dialog
      this.map.removeLayer(this.polygons[this.polygons.length - 1])
      this.isDrawing = false
      this.dialogSave = false
      this.resetPolygonData()
    },
    startMake () {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          marker: false,
          polyline: false,
          circle: false
        },
        edit: {
          featureGroup: this.drawnItems
        }
      })
      this.map.addControl(drawControl)
    }
  }
}
</script>
