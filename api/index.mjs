import {handle} from '../server/handler.mjs';
import {remoteDB} from '../server/libsql-db.mjs';
let db;
export async function GET(request){return route(request)}
export async function POST(request){return route(request)}
export async function PUT(request){return route(request)}
async function route(request){if(!process.env.LIBSQL_URL)return handle(request,{});db??=remoteDB(process.env.LIBSQL_URL,process.env.LIBSQL_AUTH_TOKEN);return handle(request,{...process.env,DB:db,BURA_AUTH_MODE:'password'})}
