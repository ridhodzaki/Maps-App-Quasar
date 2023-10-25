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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
