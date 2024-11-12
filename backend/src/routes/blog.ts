import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify} from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    //explicitely defining extra keys that we will set on context
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async(c, next) => {
    const authHeader = c.req.header("authorization") || "";

    const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user){
        c.set("userId", user.id as string);
        await next();
    }else {
        c.status(403);
        return c.text("You are not logged in");
    }
})

blogRouter.post('/',async (c) =>{
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get("userId")
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(userId)
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

//pagination
blogRouter.get('/bulk', async (c) => {
    //const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blogs = await prisma.blog.findMany({});
        return c.json({
            blogs
        })
    } catch(e){
        c.status(411);
        return c.text("Error while fetching the blog post")
    }

})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(id)
            }
        })
        console.log(blog);
        return c.json({
            blog
        })
    } catch(e){
        c.status(404);
        return c.text("Blog does not exist")
    }
})




//export default app