// import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import fetch from 'cross-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
    })

    app.get('/reset/:email/:exp/:token', {}, async (request, reply) =>
      reply.sendFile('reset.html')
    )

    app.get('/2fa', {}, async (request, reply) => reply.sendFile('2fa.html'))

    app.get('/verify/:email/:token', {}, async (request, reply) => {
      try {
        const { email, token } = request.params
        const values = { email, token }

        // Turn off SSL checking for the following query
        // const httpsAgent = new https.Agent({ rejectUnauthorized: false })

        const res = await fetch('http://localhost:3000/api/verify', {
          method: 'POST',
          body: JSON.stringify(values),
          credentials: 'include',
          // agent: httpsAgent,
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        if (res.status === 200) {
          return reply.redirect('/')
        }
        reply.code(401).send()
      } catch (e) {
        reply.code(401).send()
        console.error(e)
      }
    })

    const PORT = process.env.PORT || 3001
    await app.listen(PORT)
    console.log(`Server listening on port: ${PORT}`)
  } catch (e) {
    console.error(e)
  }
}

startApp()
