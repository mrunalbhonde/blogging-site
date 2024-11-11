import { Hono } from 'hono'
import { userRouter} from "./routes/user";
import { accountRouter} from "./routes/account";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// issue with serverless environments, we cannot globally access the env variables we put in our wrangler.toml
const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())

const app = new Hono()

app.route('/api/vi/user', userRouter);
app.route('/ap/v1/account', accountRouter);

app.listen();
export default app
