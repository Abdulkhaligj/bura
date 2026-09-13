import {handle} from '../server/handler.mjs';
import {remoteDB} from '../server/libsql-db.mjs';
let db;
export async function GET(request){return route(request)}
export async function POST(request){return route(request)}
export async function PUT(request){return route(request)}
// vercel.json-dakı /api/:path* → /api rewrite-i yolu sorğu parametri kimi ötürə bilər; handler orijinal /api/... yolunu gözləyir.
async function original(request){const url=new URL(request.url),p=url.searchParams.get('path');if(url.pathname!=='/api'||p===null)return request;url.searchParams.delete('path');url.pathname='/api/'+p.replace(/^\/+/,'');return new Request(url,{method:request.method,headers:request.headers,...(['GET','HEAD'].includes(request.method)?{}:{body:await request.arrayBuffer()})})}
async function route(request){request=await original(request);if(!process.env.LIBSQL_URL)return handle(request,{});db??=remoteDB(process.env.LIBSQL_URL,process.env.LIBSQL_AUTH_TOKEN);return handle(request,{...process.env,DB:db,BURA_AUTH_MODE:'password'})}
