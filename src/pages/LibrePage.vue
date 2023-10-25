<template>
  <q-page>
    <div class="q-pa-sm">
      <div class="row">
        <div class="col">
          <MapLibre/>
        </div>
        <!-- <div class="col"></div> -->
      </div>
    </div>
  </q-page>
</template>
<script>
import MapLibre from 'src/components/MapLibre.vue'
// import MapLeaflet from 'src/components/MapLeaflet.vue'
export default {
  components: {
    MapLibre
    // MapLeaflet
  },
  data () {
    return {
      tab: 'leaflet'
    }
  }
}
</script>
