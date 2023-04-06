import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'

const { description, version } = packageJson

export default defineManifest({
  name: 'GitHub Account Switcher',
  description,
  version,
  manifest_version: 3,
  icons: {
    '16': 'img/logo-16.png',
    '32': 'img/logo-32.png',
    '48': 'img/logo-48.png',
    '128': 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://*.github.com/*'],
      run_at: 'document_start',
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [],
  host_permissions: ['https://*.github.com/'],
  permissions: ['cookies', 'storage', 'webRequest', 'declarativeNetRequest'],
})
