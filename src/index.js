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
    let status = response.status

    const isSameUrl = c.req.url.split('/check')[0] === url || (c.req.url.split('/check')[0] + '/') === url
    if(isSameUrl) status = 200

    const isAlive = status >= 200 && status < 300
    const tooManyRequest = status === 429

    return c.json({
      status,
      message: tooManyRequest ? 'UNKNOW' : isAlive ? 'OK' : 'DOWN'
    })
  } catch (e) {
    return c.json({
      message: e
    })
  }
})

export default app