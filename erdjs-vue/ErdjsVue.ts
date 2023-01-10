// @ts-ignore
import { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Dapp from './Dapp'
import type DappType from './Dapp'
import type { EnvironmentsEnum } from './types'
import * as components from './components'
import { useTransactionsTracker } from 'erdjs-vue/hooks/transactions/useTransactionsTracker';

import "erdjs-vue/assets/scss/styles.scss";

export interface ErdjsVue {
  dapp: DappType,
  options: ErdjsVueOptions,
  install(app: App): void,
  getDapp(): DappType,
}

export interface ErdjsVueOptions {
  chain?: string
}

const defaultOptions: ErdjsVueOptions = {
  chain: 'devnet',
}

export function erdjsVue(options: ErdjsVueOptions = defaultOptions): ErdjsVue {
  const erdjs: ErdjsVue = {
    dapp: {} as DappType,
    options: options,
    install(app: App) {
      const pinia = createPinia();
      pinia.use(piniaPluginPersistedstate);
      app.use(pinia);

      this.dapp = new Dapp(options.chain as EnvironmentsEnum);
      this.dapp.init();

      // Auto import all components
      for (const componentKey in components) {
        app.use((components as any)[componentKey])
      }

      app.config.globalProperties.$erdjs = this;
      app.provide('erdjs', this)

      setTimeout(() => {
        useTransactionsTracker();
      }, 1000)
    },
    getDapp() {
      return this.dapp
    }
  }

  return erdjs;
}
