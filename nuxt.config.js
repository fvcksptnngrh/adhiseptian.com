const path = require('path')

export default {
  target: 'static',

  head: {
    title: 'Adhi Septian Nugroho — Frontend Developer',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Adhi Septian Nugroho — Frontend Developer | Vue, Nuxt, React, TypeScript | Informatics Engineering Student at UKSW' },
      { name: 'theme-color', content: '#0d0d0d', hid: 'theme-color' }
    ],
    script: [
      {
        hid: 'theme-init',
        innerHTML: '(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.add("light")}}catch(e){}})()',
        type: 'text/javascript',
        body: false
      }
    ],
    __dangerouslyDisableSanitizers: ['script'],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'preconnect', href: 'https://cdn.simpleicons.org' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fira+Code:wght@400;500&display=swap'
      }
    ]
  },

  css: [
    '~/assets/css/tailwind.css',
    '~/assets/scss/_global.scss'
  ],

  plugins: [
    { src: '~/plugins/theme.client.js', mode: 'client' },
    { src: '~/plugins/aos.client.js', mode: 'client' },
    { src: '~/plugins/gsap.client.js', mode: 'client' },
    { src: '~/plugins/tracking.client.js', mode: 'client' }
  ],

  buildModules: [],

  modules: ['@nuxtjs/style-resources'],

  styleResources: {
    scss: ['~/assets/scss/_variables.scss']
  },

  serverMiddleware: process.env.NODE_ENV === 'development' ? [
    { path: '/api/wakatime', handler: path.resolve(__dirname, 'server-middleware/wakatime.js') },
    { path: '/api/github', handler: path.resolve(__dirname, 'server-middleware/github.js') },
    { path: '/api/guestbook', handler: path.resolve(__dirname, 'server-middleware/guestbook.js') },
    { path: '/api/engagements', handler: path.resolve(__dirname, 'server-middleware/engagements.js') }
  ] : [],

  publicRuntimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_ANON_KEY || ''
  },

  build: {
    transpile: ['gsap', 'tailwind-merge', 'clsx', 'lucide-vue', '@supabase/supabase-js', '@supabase/node-fetch', '@supabase/postgrest-js', '@supabase/realtime-js', '@supabase/storage-js', '@supabase/functions-js', '@supabase/gotrue-js', '@supabase/auth-js', 'iceberg-js', '@supabase/phoenix'],
    postcss: {
      postcssOptions: {
        plugins: { tailwindcss: {}, autoprefixer: {} }
      }
    }
  },

  loading: {
    color: '#06b6d4',
    height: '2px'
  }
}
