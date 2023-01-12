import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({
  endpoint: '/check?url=',
  description: 'Returns the health of a provided webpage.',
  example: {
    get: '/check?url=https://whoknows-portfolio.vercel.app',
    response: {
      status: '200',
      message: 'OK'
    }
  }
}))

app.get(`/check`, async (c) => {
  const url = c.req.query('url')

  if (!url || (!url?.includes('http') && !url?.includes('https'))) {
    c.status(400)
    return c.json({
      message: 'Please provide a valid url'
    })
  }

  try {
    const response = await fetch(url)
    const isAlive = response.status >= 200 && response.status < 300 
    const tooManyRequest = response.status === 429

    return c.json({
      status: response.status,
      message: tooManyRequest ? 'UNKNOW' : isAlive ? 'OK' : 'DOWN'
    })
  } catch (e) {
    console.log(e)
    return c.json({
      message: e
    })
  }
})

export default app