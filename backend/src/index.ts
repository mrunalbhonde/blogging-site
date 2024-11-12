import { Hono } from 'hono'
import { userRouter} from "./routes/user";
import { blogRouter} from "./routes/blog";


// issue with serverless environments, we cannot globally access the env variables we put in our wrangler.toml
// can only access using the context or c variable
// therefore prisma client initialisation needs to happen inside each route
// to show we are using connection pool using accelerate .$extends(withAccelerate())
const app = new Hono()

// typescript will kalso have a type error for variables/bindings inside prisma client init as ts doesnt know their types

app.route('/api/vi/user', userRouter);
app.route('/ap/v1/blog', blogRouter);

// app.listen();
export default app
