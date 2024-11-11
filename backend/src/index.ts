import { Hono } from 'hono'
import { userRouter} from "./routes/user";
import { accountRouter} from "./routes/account";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// issue with serverless environments, we cannot globally access the env variables we put in our wrangler.toml
// can only access using the context or c variable
// therefore prisma client initialisation needs to happen inside each route
// to show we are using connection pool using accelerate .$extends(withAccelerate())
const app = new Hono<{
  Variables: {

  },
  Bindings: {
    
  }
}>()

// typescript will kalso have a type error for variables/bindings inside prisma client init as ts doesnt know their types
const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())



app.route('/api/vi/user', userRouter);
app.route('/ap/v1/account', accountRouter);

app.listen();
export default app
