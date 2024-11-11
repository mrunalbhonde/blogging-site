import { Hono } from 'hono'

const app = new Hono()

app.post('/signup', (c){

})

app.post('/signup', (c){

})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
