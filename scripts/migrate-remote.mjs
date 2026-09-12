import {createClient} from '@libsql/client';import {readdir,readFile} from 'node:fs/promises';
try{process.loadEnvFile('.env')}catch{}
if(!process.env.LIBSQL_URL||!process.env.LIBSQL_AUTH_TOKEN)throw Error('Set LIBSQL_URL and LIBSQL_AUTH_TOKEN for the dedicated BURA database.');
const db=createClient({url:process.env.LIBSQL_URL,authToken:process.env.LIBSQL_AUTH_TOKEN});await db.execute('CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY)');
for(const name of (await readdir('drizzle')).filter(x=>x.endsWith('.sql')).sort()){if((await db.execute({sql:'SELECT 1 FROM _migrations WHERE name=?',args:[name]})).rows.length)continue;const sql=await readFile('drizzle/'+name,'utf8');const stmts=sql.split('--> statement-breakpoint').map(x=>x.trim()).filter(Boolean).map(sql=>({sql,args:[]}));stmts.push({sql:'INSERT INTO _migrations (name) VALUES (?)',args:[name]});await db.batch(stmts,'write');console.log('Applied',name)}db.close();
