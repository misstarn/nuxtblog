// https://nuxt.com/docs/api/configuration/nuxt-config
import lineclamp from '@tailwindcss/line-clamp'

export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 1999
  },
  modules: [
    '@invictus.codes/nuxt-vuetify',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  apollo: {
    autoImports: true,
    authType: 'Bearer',
    authHeader: 'Authorization',
    tokenStorage: 'localStorage',
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: 'https://strapi.anran.life/graphql'
        // httpEndpoint: 'http://localhost:1337/graphql'
      }
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    exposeLevel: 2,
    config: {
      plugins: [ lineclamp ]
      
    },
    injectPosition: 'first',
    viewer: true,
  },
  runtimeConfig: {
    apiSecret: '123',
    public: {
      // apiBase: 'http://localhost:1337/api',
      // baseUrl: 'http://localhost:1337'
      apiBase: 'https://strapi.anran.life/api',
      baseUrl: 'https://strapi.anran.life'
    }
  },
  build: {
    transpile: ['@nuxtjs/apollo', '@vue/apollo-composable']
  }
  // vuetify: {
  //   /* vuetify options */
  //   vuetifyOptions: {
  //     // @TODO: list all vuetify options
  //   },

  //   moduleOptions: {
  //     /* nuxt-vuetify module options */
  //     treeshaking: true,
  //     useIconCDN: true,

  //     /* vite-plugin-vuetify options */
  //     styles: true,
  //     autoImport: true ,
  //     useVuetifyLabs: true, 
  //   }
  // }
})
