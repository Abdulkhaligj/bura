import http from 'node:http';
import {Readable} from 'node:stream';
import {readFile} from 'node:fs/promises';
import {handle} from './handler.mjs';
import {localDB} from './local-db.mjs';
try{process.loadEnvFile('.env')}catch{}
const args=process.argv.slice(2),port=Number(args[args.indexOf('--port')+1])||Number(process.env.PORT)||4173;
const db=localDB(process.env.BURA_DATABASE_PATH);const {createServer}=await import('vite');
const vite=await createServer({root:'web',server:{middlewareMode:true,host:'0.0.0.0',allowedHosts:['terminal.local']},appType:'spa'});
http.createServer(async(req,res)=>{
 if(req.url.startsWith('/api/')){try{const protocol=req.headers['x-forwarded-proto']||'http';const request=new Request(`${protocol}://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});const response=await handle(request,{...process.env,BURA_AUTH_MODE:'password',DB:db});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){console.error(e);res.writeHead(500);res.end('Server error')}}else vite.middlewares(req,res);
}).listen(port,'0.0.0.0',()=>console.log(`BURA ready on ${port}`));
