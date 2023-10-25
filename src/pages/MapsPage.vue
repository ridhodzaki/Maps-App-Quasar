<template>
  <q-page>
    <!-- Component Map -->
    <div id="map" ref="map"  :style="`width: 100%; height: ${this.$q.screen.height - 50}px; z-index: 2`">
    </div>
    <!-- Akhir Component Map -->

    <!-- Component Search -->
    <div class="absolute-top-right q-ma-xs row items-center justify-end" style="z-index: 3; width: 50%">
      <div v-if="this.$q.screen.xl || this.$q.screen.lg || this.$q.screen.md || this.$q.screen.sm" class="col">
        <q-input outlined @keyup.enter="searchLocation" :loading="loadingState" class="text-grey-10 q-pa-sm" style="border-radius: 5px; background: #FFF; padding: 0.1px" dense v-model="search" placeholder="Search">
          <template v-slot:append>
            <q-btn v-if="search.length > 0" @click="clearSearch" icon="close" flat dense/>
            <q-icon v-else name="search" flat dense/>
          </template>
        </q-input>
        <!-- List Search -->
        <q-list class="absolute-top" :style="`z-index: 3; margin-top: 40px; padding-right: 50px; width: 100%`">
          <template v-for="(result, i) in searchResults" :key="i">
            <q-item @click="centerMap(result)" clickable v-ripple class="bg-white">
              <q-item-section avatar>
                <q-icon color="grey-10" name="mdi-map-marker" />
              </q-item-section>
              <q-item-section>
                <span class="text-weight-bold text-body2"> {{ result.name }} </span>
                <span class="text-caption ellipsis-2-lines">{{ result.display_name }}</span>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
      <div v-else class="col-auto">
        <q-btn color="white" :loading="isLoading" class="q-ma-xs" @click="getLocation" text-color="grey-9" dense icon="mdi-magnify">
          <q-tooltip transition-show="flip-right" transition-hide="flip-left" anchor="center left" self="center right">
            Search
          </q-tooltip>
        </q-btn>
      </div>
      <div class="col-auto q-ml-sm">
        <q-btn color="white" :loading="isLoading" class="q-ma-xs" @click="getLocation" text-color="grey-9" dense icon="mdi-near-me">
          <q-tooltip transition-show="flip-right" transition-hide="flip-left" anchor="center left" self="center right">
            Find My Location
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <!-- Akhir Component Search -->

    <!-- Component Import Export -->
    <div class="absolute-bottom-left q-mb-md items-center bg-white" style="z-index: 3; margin-left: 20px; margin-right: 20px; width: auto; border-radius: 5px">
      <q-btn text-color="info" icon="mdi-file-import-outline" dense class="q-ma-xs" @click="showExportDialog = !showExportDialog">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Import</strong> to <em>KML</em>
        </q-tooltip>
      </q-btn>
      <q-btn text-color="positive" icon="mdi-file-export-outline" dense class="q-ma-xs" @click="exportKML">
        <q-tooltip  anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Export</strong> to <em>KML</em>
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Akhir Component Import Export -->

    <!-- Dialog Detail -->
    <transition
      appear
      v-if="isDetailOpen"
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutRight"
    >
      <div v-if="isDetailOpen" class="absolute-top-right" :style="`z-index: 2; padding-left: 30px; padding-top: 70px; padding-right: 30px; width: ${this.$q.screen.xs ? this.$q.screen.width :this.$q.screen.width / 3}px`">
        <div class="q-pa-md bg-white q-ma-sm" style="border-radius: 5px">
          <div class="column">
            <div class="row justify-between q-mb-sm">
              <div class="col-auto">
                <span class="text-h6 text-weight-medium">Detail Tanah</span>
              </div>
              <div class="col-auto">
                <q-btn icon="close" @click="closeSelectPolygon" flat dense/>
              </div>
            </div>
            <div class="column q-gutter-sm">
              <div class="row justify-end">
                <q-btn v-if="isEdit" label="Edit" no-caps color="warning" outline @click="isEdit = !isEdit"/>
              </div>
              <q-form @submit="onUpdate" class="q-gutter-sm">
                <q-input :disable="isEdit" label="Nama Lahan" outlined v-model="activeData.dataLahan.polygonName"/>
                <q-input :disable="isEdit" label="Deskripsi" type="textarea" outlined v-model="activeData.dataLahan.desc"/>
                <div class="row">
                  <span class="text-center"> {{ this.message }} </span>
                </div>
                <div class="row">
                  <q-space/>
                  <q-btn v-if="!isEdit"  label="Update" type="submit" color="primary" no-caps/>
                </div>
              </q-form>
              <!-- <span class="text-body">Nama Lahan</span>
              <span class="text-body">{{ activeData?.polygonName }}</span>
              <span class="text-body q-mt-md">Deskripsi</span>
              <span class="text-body">{{ activeData?.desc }}</span> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- Akhir Dialog Detail -->

    <!-- Dialog Tambah Polygon -->
    <q-dialog v-model="showPolygonDialog" persistent>
      <div class="q-pa-md column bg-white" :style="`width: ${ this.$q.screen.xs || this.$q.screen.sm ? this.$q.screen.width : this.$q.screen.width / 2}px`">
        <div class="row justify-between q-mb-md">
          <div class="col-auto">
            <span class="text-h5">Data Lahan</span>
          </div>
          <div class="col-auto">
            <q-btn flat dense icon="close" @click="cancelPolygon"/>
          </div>
        </div>
        <q-form class="q-gutter-xs" @submit="savePolygon">
          <q-input outlined v-model="form.polygonName" placeholder="Nama Lahan" />
          <q-input outlined type="textarea" v-model="form.desc" placeholder="Deskripsi Lahan" />
          <div class="row q-mt-sm">
            <q-space/>
            <q-btn type="submit" label="Simpan" no-caps color="primary"/>
          </div>
        </q-form>
      </div>
    </q-dialog>
    <!-- Akhir Dialog Tambah Polygon -->

    <!-- Dialog Export Polygon -->
    <q-dialog v-model="showExportDialog" persistent>
      <div v-if="showExportDialog" class="q-pa-md column bg-white" :style="`width: ${ this.$q.screen.xs || this.$q.screen.sm ? this.$q.screen.width : this.$q.screen.width / 2}px`">
        <div class="row justify-between q-mb-md">
          <div class="col-auto">
            <span class="text-h5">Upload File</span>
          </div>
          <div class="col-auto">
            <q-btn flat dense icon="close" @click="showExportDialog = !showExportDialog"/>
          </div>
        </div>
        <q-form class="q-gutter-xs" @submit="importData">
          <q-file
            outlined
            v-model="fileKML"
            label="File KML"
            accept=".kml"
            :rules="[
              val => val !== null || 'Masukan File'
            ]">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <div class="row q-mt-sm">
            <q-space/>
            <q-btn type="submit" label="Simpan" no-caps color="primary"/>
          </div>
        </q-form>
      </div>
    </q-dialog>
    <!-- Akhir Dialog Export Polygon -->
  </q-page>
</template>

<script>
import toGeoJSON from '@mapbox/togeojson'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import Swal from 'sweetalert2'

export default {
  data () {
    return {
      search: '',
      isEdit: true,
      isLoading: false,
      loadingState: false,
      map: null,
      drawnItems: new L.FeatureGroup(),
      drawControl: null,
      polygons: [],
      polygon: null,
      fileKML: null,
      searchResults: [],
      showPolygonDialog: false,
      showExportDialog: false,
      isDetailOpen: false,
      message: '',
      form: {
        polygonName: '',
        desc: ''
      },
      activeData: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      this.map = L.map('map', {
        zoomControl: false,
        zoomSnap: 0.25
      }).setView([-4.958634, 104.945778], 8)

      L.control.zoom({
        position: 'bottomright' // Mengatur posisi ke kanan bawah
      }).addTo(this.map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      }).addTo(this.map)
      this.drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.drawnItems
        }
      })
      this.map.addControl(this.drawControl)
      this.map.addLayer(this.drawnItems)

      this.map.on(L.Draw.Event.CREATED, (event) => {
        this.polygon = event.layer
        // Memunculkan dialog untuk memberikan desc
        this.showPolygonDialog = true

        // Memasukan polygon yang dibuat kedalam polygons
        this.polygons.push(this.polygon)

        // Memberikan aksi jika di klik maka memanggil showPolygonDetails
        this.polygon.on('click', this.showPolygonDetails)

        // Menampilkan ke maps polygon yang dibuat
        this.drawnItems.addLayer(this.polygon)

        // Menonaktifkan mode penggambaran
        this.drawControl._toolbars.draw.disable()
      })
    },

    // Function Search
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
          // console.log(res)
          this.searchResults = res.data
        }).catch(() => {
          // console.log(err)
          Swal.fire('Error', 'Terjadi Kesalahan Sistem', 'error')
        }), 1000
      )
    },

    // Function to get location
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
              this.lat = position.coords.latitude
              this.lng = position.coords.longitude

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

    // Function to center map for search results
    centerMap (result) {
      this.search = `${result.name}. ${result.display_name}`

      this.searchResults = []
      this.lat = result.lat
      this.lng = result.lon

      const south = parseFloat(result.boundingbox[0])
      const west = parseFloat(result.boundingbox[2])
      const north = parseFloat(result.boundingbox[1])
      const east = parseFloat(result.boundingbox[3])

      // Membuat bounding box
      const boundingBox = L.latLngBounds(L.latLng(south, west), L.latLng(north, east))

      this.map.fitBounds(boundingBox)
      const currentZoom = this.map.getZoom()
      // Membuat peta dengan koordinat tengah dan tingkat zoom awal
      this.map.setView(boundingBox.getCenter(), currentZoom)
    },

    // Function Save Polygon with Descriptions
    savePolygon () {
      // console.log(this.form)
      // const polygonsData = this.polygons.slice(0, this.polygons.length - 1)
      // if (polygonsData.length > 0) {
      //   console.log(polygonsData[0].dataLahan)
      //   polygonsData.filter((polygon) => polygon.dataLahan.polygonName.toString() === this.form.polygonName.toString())
      // }
      this.polygons[this.polygons.length - 1].dataLahan = this.form
      this.map.addLayer(this.polygons[this.polygons.length - 1])
      this.showPolygonDialog = false
      this.resetPolygonData()
      this.message = ''
    },

    // Function to Cancel Create Polygon
    cancelPolygon () {
      this.map.removeLayer(this.polygons[this.polygons.length - 1])
      this.showPolygonDialog = false
      this.resetPolygonData()
    },

    // Add Description for exported polygons
    addDescriptionToPolygons (polygons) {
      polygons.forEach((polygon, index) => {
        const description = polygon.dataLahan.landType
        // console.log(polygon.getLatLngs()[0])
        // console.log(polygon.getLatLngs()[0].length)
        polygon.getLatLngs()[0][polygon.getLatLngs()[0].length] = polygon.getLatLngs()[0][0]
        // console.log(polygon.getLatLngs()[0].length)
        // console.log(polygon.getLatLngs()[0])
        const coordinates = polygon.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat, 0.0])

        polygon.feature = {
          type: 'Feature',
          properties: {
            name: `${polygon.dataLahan.polygonName}`,
            description
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          }
        }
        // console.log(polygon)
      })
    },

    // Function for Export Polygon
    exportKML () {
      if (this.polygons.length === 0) {
        this.$q.notify({
          message: 'No polygons to export',
          color: 'negative'
        })
        return
      }
      this.addDescriptionToPolygons(this.polygons)

      let kmlFeatures = ''

      const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>\n
        <Style id="AREA_FF00FF00">
          <LineStyle>
            <color>FF00FF00</color>
            <width>2</width>
          </LineStyle>
          <PolyStyle>
            <color>8000FF00</color>
            <fill>1</fill>
            <outline>1</outline>
          </PolyStyle>
        </Style>`

      this.polygons.forEach((polygon) => {
        const name = polygon.feature.properties.name
        const description = polygon.feature.properties.description
        // Mengambil koordinat polygon (contoh untuk Polygon)
        const coordinates = polygon.feature.geometry.coordinates[0].map(coord => coord.join(',')).join(' ')

        kmlFeatures += `<Placemark>
          <name>${name}</name>
          <description>${description}</description>
          <styleUrl>#AREA_FF00FF00</styleUrl>
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>${coordinates}</coordinates>
              </LinearRing>
            </outerBoundaryIs>
          </Polygon>
          </Placemark>\n`
      })

      const kmlFooter = '</Document>\n</kml>'

      const kml = kmlHeader + kmlFeatures + kmlFooter

      // Ekspor KML sesuai kebutuhan Anda
      // console.log(kml)

      const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'polygons.kml'
      a.click()
    },

    // Function to Import Polygons
    importData () {
      const reader = new FileReader()
      reader.onload = (e) => {
        const kmlData = e.target.result
        const geoJSON = toGeoJSON.kml(new DOMParser().parseFromString(kmlData, 'text/xml'))
        const bounds = L.geoJSON(geoJSON).getBounds()
        // console.log(geoJSON)
        this.map.fitBounds(bounds)
        L.geoJSON(geoJSON, {
          onEachFeature: (feature, layer) => {
            if (feature.geometry.type === 'Polygon') {
              const descs = layer.feature.properties.description ?? '-'
              const name = layer.feature.properties.name ?? '-'
              layer.options.clickable = true
              layer.dataLahan = {
                polygonName: name,
                desc: descs
              }

              layer.on('click', this.showPolygonDetails)
              this.polygons.push(layer)
            }
          }
        }).addTo(this.map)
      }
      reader.readAsText(this.fileKML)
      this.showExportDialog = !this.showExportDialog
    },

    // Function to Show Detail from polygons
    showPolygonDetails (e) {
      // console.log(e)
      if (this.currentYellowPolygon) {
        this.currentYellowPolygon.setStyle({ color: 'red' })
      }

      this.currentYellowPolygon = e.target
      e.target.setStyle({ color: 'yellow' })
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker)
      }

      if (this.currentCircleMarker) {
        this.map.removeLayer(this.currentCircleMarker)
      }
      this.activeData = e.target
      this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map)
      this.map.setView([e.latlng.lat, e.latlng.lng])
      this.isDetailOpen = true
    },

    // Function to close selected polygon
    closeSelectPolygon () {
      if (this.currentYellowPolygon) {
        this.currentYellowPolygon.setStyle({ color: 'red' })
      }
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker)
      }
      this.isDetailOpen = false
      this.isEdit = true
    },

    // Function to Reset Desc on Polygon
    resetPolygonData () {
      this.form = {
        polygonName: '',
        desc: ''
      }
    },

    onUpdate () {
      // console.log(this.polygons)
      const index = this.polygons.findIndex(item => item._leaflet_id === this.activeData._leaflet_id)
      this.polygons[index].dataLahan = this.activeData.dataLahan
      this.activeData = null
      this.closeSelectPolygon()
    },

    clearSearch () {
      this.searchResults = []
      this.search = ''
    }
  }
}
</script>
