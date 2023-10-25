<template>
  <q-page class="q-pa-lg">
    <div :class="`row justify-between items-center`" :style="`${this.$q.screen.xs || this.$q.screen.sm ? 'flex-direction: column-reverse;' : 'height: 90vh'}`">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div class="column text-left q-mt-md q-gutter-md">
          <span key="1" :class="`text-weight-bold list-left ${this.$q.screen.xs || this.$q.screen.sm ? 'text-h6' : 'text-h4 '}`">Welcome to</span>
          <span key="2" :class="`text-weight-bolder list-left ${this.$q.screen.xs || this.$q.screen.sm ? 'text-h4' : 'text-h2 '}`">My Maps</span>
          <span key="3" :class="`text-weight-thin list-left ${this.$q.screen.xs || this.$q.screen.sm ? 'text-caption' : 'text-body1'}`">{{ description }}</span>
          <div key="4" class="row q-gutter-sm list-left">
            <q-btn
              class="q-mt-sm buttonProfile raise"
              unelevated
              @click="this.$router.push({ name: 'maps' })"
              outline
              label="Maps"
              no-caps
            />
            <q-btn
              class="q-mt-sm buttonProfile slide"
              unelevated
              @click="this.$router.push({ name: 'mapLeaflet' })"
              outline
              label="Maps Leaflet Test"
              no-caps
            />
            <q-btn
              class="q-mt-sm buttonProfile slide"
              unelevated
              @click="this.$router.push({ name: 'mapLibre' })"
              outline
              label="Maps Libre Test"
              no-caps
            />
          </div>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div :class="`row ${this.$q.screen.xs || this.$q.screen.sm ? 'flex flex-center' : 'justify-end'}`">
          <div class="col-auto" style="width: 70%">
            <lottie :options="defaultOptions" v-on:animCreated="handleAnimation" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Lottie from '../components/LottieAnimate.vue'
import * as animationData from '../assets/globe.json'
export default {
  components: {
    Lottie
  },
  data () {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 2,
      description: 'Website yang menyediakan daftar contoh maps dari Quasar.'
    }
  },
  mounted () {
    const semuaElemenItem = this.$el.querySelectorAll('.list-left')
    semuaElemenItem.forEach((elemen, i) => {
      setTimeout(() => {
        // const elemen = semuaElemenItem[i]
        elemen.classList.add('show-parallax')
      }, 300 * (i + 1))
    })
    for (const elementId in this.observedElements) {
      if (this.observedElements[elementId] === false) {
        const element = document.getElementById(elementId)
        if (element) {
          const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Tandai elemen sebagai telah terlihat
                this.observedElements[elementId] = true

                // Panggil fungsi yang sesuai
                if (elementId === 'listskill') {
                  this.animateProgress()
                } else if (elementId === 'listtools') {
                  this.animateProgresslisttools()
                }

                // Hentikan observasi elemen
                observer.unobserve(element)
              }
            })
          })

          observer.observe(element)
        }
      }
    }
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim
    },
    stop: function () {
      this.anim.stop()
    },
    play: function () {
      this.anim.play()
    },
    pause: function () {
      this.anim.pause()
    },
    onSpeedChange: function () {
      this.anim.setSpeed(this.animationSpeed)
    }
  }
}
</script>
