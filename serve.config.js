const path = require('path')

const chokidar = require('chokidar')
const stringify = require('json-stringify-safe')
const WebSocket = require('ws')

const folder = path.resolve(__dirname, 'docs')

module.exports = {
  content: [
    folder
  ],
  on: {
    listening (server) {
      const socket = new WebSocket('ws://localhost:8081')
      const options = {}
      const watcher = chokidar.watch(folder, options)

      watcher.on('change', () => {
        const data = {
          type: 'broadcast',
          data: {
            type: 'window-reload',
            data: {}
          }
        }

        socket.send(stringify(data))
      })

      server.on('close', () => {
        watcher.close()
      })
    }
  }
}
