<template>
  <q-layout view="lHh lpR fFf">
    <q-header>
      <q-toolbar style="background-img: 'img/mountains.jpg'">
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="white"
          aria-label="Menu"
          @click="drawer = !drawer"
        />
        <q-toolbar-title>
          <span class="text-h5">MyMaps</span>
        </q-toolbar-title>

        <div>
          <span>{{ todayDate }}</span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="400"
      :overlay="this.$q.screen.xs ? true : false"
      :behavior="this.$q.screen.xs ? 'mobile' : 'desktop'"
    >
      <q-scroll-area style="height: calc(100% - 180px); margin-top: 180px; border-right: 1px solid #ddd">
        <q-list padding>
          <template
            v-for="(drawer, i) in listDrawer"
            :key="i">
            <q-item
              :to="{ name: drawer.to }"
              clickable
              v-ripple
              exact
              class="item"
              active-class="item-active">
              <q-item-section avatar>
                <q-icon :name="drawer.icon" />
              </q-item-section>

              <q-item-section>
                {{ drawer.name }}
              </q-item-section>
            </q-item>

            <q-item
              to="aboutme"
              clickable
              v-ripple
              exact
              class="item absolute-bottom q-mb-md"
              style="margin-bottom: 20px">
              <q-item-section avatar>
                <q-icon name="mdi-account" />
              </q-item-section>

              <q-item-section>
                About Author
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>

      <div class="absolute-top q-pa-md" style="height: 180px; width: 100%">
        <div class="absolute-bottom bg-transparent q-pa-md">
          <div class="column">
            <span class="text-weight-bold text-body1">Creator</span>
          </div>
          <div class="flex flex-center">
            <q-avatar size="80px" class="q-mb-sm">
              <img src="img/avatar.jpg">
            </q-avatar>
          </div>
          <div class="column">
            <span class="text-weight-bold text-body1">Riki</span>
            <span class="text-subtitle">@ridhodzaki</span>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
      drawer: false,
      listDrawer: [
        {
          to: 'dashboard',
          icon: 'mdi-monitor-dashboard',
          name: 'Dashboard'
        },
        {
          to: 'help',
          icon: 'mdi-help',
          name: 'Help'
        }
      ]
    }
  },
  computed: {
    todayDate () {
      const timestamp = Date.now()
      return date.formatDate(timestamp, 'dddd, D MMMM YYYY')
    }
  }
}
</script>
