<template>
  <div class="fullscreen text-grey-10 text-center q-pa-md flex flex-center">
    <div :class="`row justify-between items-center`" style="height: 90vh">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div :class="`row flex flex-center`">
          <div class="col-auto" style="width: 70%">
            <lottie :options="defaultOptions" v-on:animCreated="handleAnimation" />
          </div>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div class="column text-left q-mt-md q-gutter-md">
          <span :class="`text-weight-bold ${this.$q.screen.xs || this.$q.screen.sm ? 'text-h6' : 'text-h4 '}`">404</span>
          <span :class="`text-weight-bolder ${this.$q.screen.xs || this.$q.screen.sm ? 'text-h4' : 'text-h2 '}`">Oops. Nothing here...</span>
          <span :class="`text-weight-thin ${this.$q.screen.xs || this.$q.screen.sm ? 'text-caption' : 'text-body1'}`">{{ description }}</span>
          <div class="row q-gutter-sm">
            <q-btn
              class="q-mt-sm buttonProfile raise"
              unelevated
              outline
              @click="this.$router.go(-1)"
              label="Go Back"
              no-caps
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Lottie from '../components/LottieAnimate.vue'
import * as animationData from '../assets/not-found.json'
export default {
  name: 'ErrorNotFound',
  components: {
    Lottie
  },
  data () {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 2,
      description: 'Sepertinya ada tersasar, kami sarankan kembali ke halaman sebelumnya ya, klik di bawah ini.'
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
