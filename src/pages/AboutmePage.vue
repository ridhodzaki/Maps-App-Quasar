<template>
  <q-page class="q-pa-md">
    <div :class="`row justify-between items-center`" :style="`${this.$q.screen.xs || this.$q.screen.sm ? 'flex-direction: column-reverse;' : 'height: 90vh'}`">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <div class="column text-left q-mt-md q-gutter-md">
          <span :class="`text-weight-bold list-left ${this.$q.screen.xs || this.$q.screen.sm ? 'text-h6' : 'text-h4 '}`">Hi, I’m  Ridho Dzaki S.</span>
          <span :class="`text-weight-bolder list-left ${this.$q.screen.xs || this.$q.screen.sm ? 'text-h4' : 'text-h2 '}`">Junior Programmer</span>
          <span :class="`text-weight-thin list-left ${this.$q.screen.xs || this.$q.screen.sm ? 'text-caption' : 'text-body1'}`">{{ description }}</span>
          <div class="row q-gutter-sm list-left">
            <q-btn
              class="q-mt-sm buttonProfile raise"
              unelevated
              outline
              @click="scrollToComponent"
              label="My Skills"
              no-caps
            />
            <q-btn
              class="q-mt-sm buttonProfile slide"
              unelevated
              outline
              @click="this.$router.go(-1)"
              label="Kembali"
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
    <div class="row">
      <div class="col-md-6 col-sm-6 col-xs-12">
        <div class="q-mt-md column" style="width: 100%">
          <span class="text-left text-weight-bold text-h5 q-mb-sm">SKILLS</span>
          <div class="q-pa-sm column bg-grey-1 q-ma-sm text-grey-10" style="border-radius: 5px;">
            <div id="listskill"  class="q-my-sm" v-for="(skil, i) in listSkils" :key="i">
              <span>{{ skil.nameSkil }}</span>
              <q-linear-progress :value="skil.progres" size="10px" rounded color="primary" track-color="secondary" class="q-mt-sm" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-sm-6">
        <div class="q-mt-md column">
          <span class="text-left text-weight-bold text-h5 q-mb-sm">Tools</span>
          <div id="listtools" class="row justify-evenly bg-grey-1 q-ma-sm q-pa-sm text-grey-10" style="border-radius: 5px; height: 100%">
            <img
              v-for="(image, i) in listImage"
              :key="i"
              :class="`col-4 tools-dev q-ma-sm ${image.showParallax ? 'show-parallax' : ''}`"
              style="width: 40px; height: 40px"
              :src="`img/img-tools/${image.name}`"
              :alt="image.name"
              :title="image.name">
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Lottie from '../components/LottieAnimate.vue'
import * as animationData from '../assets/programmer.json'

export default {
  components: {
    Lottie
  },
  data () {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 2,
      observedElements: {
        listskill: false,
        listtools: false
      },
      listImage: [
        'ic-android-studio.png',
        'ic-bootstrap.png',
        'ic-codeigniter.png',
        'ic-css3.png',
        'ic-html5.png',
        'ic-laravel.png',
        'ic-vs-code.png',
        'javascript.png',
        'scss.png'
      ].map(image => ({ name: image, showParallax: false })),
      listProgress: [],
      listSkils: [
        {
          nameSkil: 'Web Front End',
          progres: 0.7
        },
        {
          nameSkil: 'Web Back End CRUD Autentication',
          progres: 0.75
        },
        {
          nameSkil: 'Mobile Apps',
          progres: 0.6
        }
      ],
      description: 'Perkenalkan aku adalah seorang creative enthusiast yang berfokus pada bidang programming dan IoT, Saya lulus dari dunia perkuliahan dengan program studi Informatika pada tahun 2022 yang masih newbie dalam ilmu, kemampuan, pengetahuan dan pastinya pengalaman.'
    }
  },
  created () {
    this.listProgress = this.listSkils.map(skil => skil.progres)
    this.listSkils[0].progres = this.listSkils[1].progres = this.listSkils[2].progres = 0
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
    scrollToComponent () {
      const element = document.getElementById('listskill')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
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
    },
    animateProgress () {
      setTimeout(() => {
        for (const index in this.listSkils) {
          this.listSkils[index].progres = this.listProgress[index]
        }
      }, 500)
    },
    animateProgresslisttools () {
      // console.log('jalan')
      this.listImage.forEach((tool, i) => {
        setTimeout(() => {
          this.listImage[i].showParallax = true
        }, 300 * (i + 1))
      })
    }
  }
}
</script>

<style lang="scss">
// And from the left
.slide:hover,
.slide:focus {
  box-shadow: inset 8.5em 0 0 0 #{adjust-hue(#1976D2, 10deg)};
}

.raise:hover,
.raise:focus {
  color: #1976D2 !important;
  box-shadow: 0 0.5em 0.5em -0.1em #{adjust-hue(#1976D2, 10deg)};
  transform: translateY(-0.25em);
}

.buttonProfile {
  border-radius: 5px;
  color: #1976D2;
  font: inherit;
  background: none;
  transition: 0.25s;

  &:hover,
  &:focus {
    border-color: #{adjust-hue(#1976D2, 10deg)};
    color: #fff;
  }
}

.buttonProfile {
  background: none;
  border: .5px solid;
  font: inherit;
  line-height: 1;
  margin: 0.5em;
  padding: 1em 2em;
}

.list-left {
  opacity: 0;
  -webkit-transition: 1.5s;
  transition: 1.5s;
  -webkit-transform: translate(-24px, 0px);
          transform: translate(-24px, 0px);
}

.tools-dev {
  opacity: 0;
  -webkit-transition: 1.5s;
  transition: 1.5s;
  -webkit-transform: translate(0, 24px);
          transform: translate(0, 24px);
}

.show-parallax {
  opacity: 1 !important;
  -webkit-transform: translate(0, 0) !important;
}
</style>
