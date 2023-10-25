const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/DashboardMaps.vue') },
      { path: 'mapLibre', name: 'mapLibre', component: () => import('src/pages/LibrePage.vue') },
      { path: 'mapLeaflet', name: 'mapLeaflet', component: () => import('src/pages/LeafletPage.vue') },
      { path: 'maps', name: 'maps', component: () => import('src/pages/MapsPage.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: 'aboutme', name: 'aboutme', component: () => import('src/pages/AboutmePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
