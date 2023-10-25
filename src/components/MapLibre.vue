<template>
  <div id="map" :style="`width: 100%; height: ${this.$q.screen.height}px`"></div>
</template>
<script>
import maplibregl from 'maplibre-gl'
export default {
  data () {
    return {
      lng: 0,
      lat: 0
    }
  },
  mounted () {
    console.log('jalan')
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        this.initializeMap()
      }, (error) => {
        console.error('Error getting location:', error)
      })
    } else {
      console.error('Geolocation is not available in this browser.')
    }
  },
  methods: {
    initializeMap () {
      this.map = new maplibregl.Map({
        container: 'map',
        style: 'https://demotiles.maplibre.org/style.json', // Ganti dengan gaya peta yang sesuai
        center: [this.lng, this.lat], // Ganti dengan koordinat pusat Anda
        zoom: 12 // Ganti dengan level zoom awal yang sesuai
      })
      new maplibregl.Marker()
        .setLngLat([this.lng, this.lat]) // Ganti dengan koordinat marker Anda
        .addTo(this.map)
      this.map.on('click', (e) => {
        const { lng, lat } = e.lngLat
        console.log(`Koordinat klik: ${lng}, ${lat}`)
      })
    }
  }
}
</script>
