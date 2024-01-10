const port = 8002

const users = require('./configs/users')
const cors = require('cors')

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors())

var clients = {}

// console.log('heyyy',io);

try {
   io.on('connection', (client) => {
      console.log('eclient', client)

      client.on('sign-in', (e) => {
         console.log('e', e)
         let user_id = e.id
         if (!user_id) return
         client.user_id = user_id
         if (clients[user_id]) {
            clients[user_id].push(client)
         } else {
            clients[user_id] = [client]
         }
      })

      client.on('message', (e) => {
         let targetId = e.to
         let sourceId = client.user_id
         if (targetId && clients[targetId]) {
            clients[targetId].forEach((cli) => {
               cli.emit('message', e)
            })
         }

         if (sourceId && clients[sourceId]) {
            clients[sourceId].forEach((cli) => {
               cli.emit('message', e)
            })
         }
      })

      client.on('disconnect', function () {
         if (!client.user_id || !clients[client.user_id]) {
            return
         }
         let targetClients = clients[client.user_id]
         for (let i = 0; i < targetClients.length; ++i) {
            if (targetClients[i] == client) {
               targetClients.splice(i, 1)
            }
         }
      })
   })
} catch (er) {
   console.log(er)
}

app.get('/users', (req, res) => {
   res.send({ data: users })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
