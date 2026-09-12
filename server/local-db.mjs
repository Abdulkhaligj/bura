import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
export function localDB(path='.local/bura.sqlite'){
 if(path!==':memory:')mkdirSync(dirname(resolve(path)),{recursive:true});const sql=new DatabaseSync(path);sql.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;');sql.exec('CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY)');
 for(const file of readdirSync(new URL('../drizzle/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort())if(!sql.prepare('SELECT 1 FROM _migrations WHERE name=?').get(file)){sql.exec('BEGIN');try{sql.exec(readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));sql.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e}}
 const prepare=(query,args=[])=>({bind(...values){return prepare(query,values)},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){const r=sql.prepare(query).run(...args);return {success:true,meta:{changes:Number(r.changes)}}}});
 return {prepare,async batch(stmts){sql.exec('BEGIN');try{const out=[];for(const s of stmts)out.push(await s.run());sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}},close:()=>sql.close(),sql};
}
