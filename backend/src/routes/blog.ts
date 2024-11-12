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

blogRouter.use('/*', async(c, next) => {

    await next();

})

blogRouter.post('/',async (c) =>{
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: 1 //hardcoded
        }
    })

    return c.json({
        id: blog.id
    })

})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.get('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = prisma.blog.findFirst({
            where: {
                id: body.id
            }
        })
    
        return c.json({
            blog
        })
    } catch(e){
        c.status(404);
        return c.text("Blog does not exist")
    }
})

//pagination
blogRouter.get('/bulk', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blogs = prisma.blog.findMany({
            where: {
                id: body.id
            }
        })
    
        return c.json({
            blogs
        })
    } catch(e){
        c.status(411);
        return c.text("Error while fetching the blog post")
    }

})


//export default app