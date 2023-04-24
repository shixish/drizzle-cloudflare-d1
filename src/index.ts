import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { InferModel, eq } from 'drizzle-orm';
import { users } from './schema';

// Best resource I've found for this: https://sat0shi.dev/posts/drizzle-intro/
// Also https://github.com/toyamarinyon/trpc-d1-todo


export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;

  DB: D1Database;
}

// async function injectDB(request: IRequest, env: Env) {
//   const db = drizzle(env.DB);
//   request.db = db;

//   // db.run(sql`
//   // SELECT ${statItemAggregation.userId},
//   //   PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY ${statItemAggregation.revenue}) as median_revenue,
//   //   PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY ${statItemAggregation.connectTalkbackTime}) as median_talk_time
//   // FROM ${statItemAggregation}
//   // WHERE ${statItemAggregation.revenue} > 0
//   // GROUP BY 1;
//   // `);

//   // const result = await db.select().from(statItemAggregation)
//   //   .fields({
//   //     userId: statItemAggregation.userId,
//   //     medianRevenue: sql<number>`PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY ${statItemAggregation.revenue})`,
//   //     medianTalkTime: sql<number>`PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY ${statItemAggregation.connectTalkbackTime})`,
//   //   })
//   //   .where(gt(statItemAggregation.revenue, 0))
//   //   .groupBy(sql`1`)
//   //   .execute();
// }

// const router = Router({ base: '/' });

// // router.get('/users', injectDB, async (req: RequestWithDB) => {
// //   const query = req.db!.select().from(users);
// //   console.log(query.toSQL());
// //   const result = await query.all();
// //   return json(result);
// // });

// // router.get('/users/:id', injectDB, async (req: RequestWithDB) => {
// //   const result = await req.db!
// //     .select().from(users)
// //     .where(eq(users.id, Number(req.params!['id'])))
// //     .get();
// //   return json(result);
// // });

// router.post('/users', async (req: RequestWithDB) => {
//   // const { name, email } = await req.json!();
//   // const res = await req.db!.insert(users).values({ name, email }).returning().get();
//   // return json({ res });
//   console.log('ok');
// });

export type NewUser = InferModel<typeof users, 'insert'>;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/favicon.ico") {
      return new Response();
    }

    // const { results } = await env.DB.prepare(
    //   "SELECT * FROM Customers WHERE CompanyName = ?"
    // )
    //   .bind("Bs Beverages")
    //   .all();
    const queryString = `select "id", "name", "email" from "users"`;
    const { results } = await env.DB.prepare(queryString).all();
    console.log(`results`, results);
    // return Response.json(results);

    // return new Response(
    //   "Call /api/beverages to see everyone who works at Bs Beverages"
    // );

    const db = drizzle(env.DB);

    const newUser: NewUser = {
      name: 'Someone',
      email: "someone@example.com",
    };
    const inserted /* : City[] */ = await db.insert(users).values(newUser).returning();
    // const [ user ] = inserted;
    console.log(`inserted`, inserted);

    const query = db.select().from(users);
    console.log(`query`, query);
    // console.log(query.toSQL());
    const result = await query.run();
    console.log(`result`, result);
    // return Response.json(result);
    return new Response("Hello World!");
  },
};
