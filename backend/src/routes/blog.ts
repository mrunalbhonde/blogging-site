import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>();

blogRouter.post('/*', async(c) => {

})

blogRouter.post('/',async (c) =>{

})

blogRouter.put('/', async (c) => {

})

blogRouter.get('/:id', async (c) => {

})

blogRouter.get('/bulk', async (c) => {

})


//export default app