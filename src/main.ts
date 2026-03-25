import { createApp } from 'vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  FaGithub,
  FaLinkedin,
  BiEnvelope,
  BiArrowRight,
  BiArrowUpRight,
  HiMenu,
  HiX,
  BiTelephone,
  BiChevronRight,
  BiChat,
  BiSend,
  BiCodeSlash,
  BiGlobe,
  BiClipboard,
  BiClock,
  BiCurrencyDollar,
  CoJavascript,
  CoTypescript,
  CoVueJs,
  CoReact,
  CoNextJs,
  CoNuxtJs,
  CoPython,
  CoNodeJs,
  CoPostgresql,
  CoMongodb,
  CoMysql,
  CoDocker,
  CoGit,
  CoFirebase,
  SiTailwindcss,
  SiFastapi,
  SiNestjs,
  SiExpress,
} from 'oh-vue-icons/icons'

import { createHead } from '@unhead/vue/client'
import { router } from '@/router'
import App from '@/App.vue'
import '@/styles/main.css'

addIcons(
  FaGithub, FaLinkedin, BiEnvelope, BiArrowRight, BiArrowUpRight, HiMenu, HiX,
  BiTelephone, BiChevronRight, BiChat, BiSend, BiCodeSlash, BiGlobe, BiClipboard,
  BiClock, BiCurrencyDollar,
  CoJavascript, CoTypescript, CoVueJs, CoReact, CoNextJs, CoNuxtJs,
  CoPython, CoNodeJs, CoPostgresql, CoMongodb, CoMysql,
  CoDocker, CoGit, CoFirebase,
  SiTailwindcss, SiFastapi, SiNestjs, SiExpress,
)

const app = createApp(App)
const head = createHead()
app.use(head)

app.component('VIcon', OhVueIcon)
app.use(router)

app.mount('#app')
