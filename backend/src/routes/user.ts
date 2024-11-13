import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@mrubhonde/medium-blog-common"


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  };
}>();

userRouter.post('/signup', async (c) => {
  
  const body = await c.req.json();
  const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.text("Inputs not correct");
  }
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  //duplicate email, prisma throws exception as it is unique field
  try{
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      }
    });
    const token = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.json({token});
  } catch(e){
    c.status(401);
    return c.text("User already exists");
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const {success} = signinInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.text("Inputs not correct");
  }
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  //duplicate email, prisma throws exception as it is unique field
  try{
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
        name: body.name,
      }
    });
    if(!user){
      c.status(403); //unauthorized wrong cred status code
      return c.text("User not Found");
    }
    const token = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.json({token});
  } catch(e){
    c.status(401);
    return c.text("Invalid");
  }
})

userRouter.get('/', (c) => {
  return c.text('Hello Hono!')
})

// export userRouter;
