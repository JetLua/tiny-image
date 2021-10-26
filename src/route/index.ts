export default [
  {
    path: '/',
    component: require('./entry').default
  },
  {
    path: '/admin',
    component: require('./admin').default
  },
]
