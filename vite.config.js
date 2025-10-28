import { defineConfig } from 'vite'
import { resolve, join } from 'node:path'
import { readdirSync, readFileSync, statSync } from 'node:fs'

function twigTemplatePlugin() {
  return {
    name: 'twig-template-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/templates/')) {
          next()
          return
        }
        const filePath = resolve(process.cwd(), `.${req.url}`)
        try {
          const source = readFileSync(filePath)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(source)
        } catch (error) {
          res.statusCode = 404
          res.end('Template not found')
        }
      })
    },
    generateBundle() {
      const baseDir = resolve(process.cwd(), 'templates')
      const emitRecursive = (dir, prefix = '') => {
        for (const entry of readdirSync(dir)) {
          const absolute = join(dir, entry)
          const relative = prefix ? `${prefix}/${entry}` : entry
          const stats = statSync(absolute)
          if (stats.isDirectory()) {
            emitRecursive(absolute, relative)
          } else {
            const source = readFileSync(absolute)
            this.emitFile({
              type: 'asset',
              fileName: `templates/${relative}`,
              source,
            })
          }
        }
      }
      emitRecursive(baseDir)
    },
  }
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [twigTemplatePlugin()],
  server: {
    fs: {
      allow: ['.'],
    },
  },
  build: {
    emptyOutDir: true,
  
  },
})
