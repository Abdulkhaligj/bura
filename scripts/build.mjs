import {build as viteBuild} from 'vite';
import {build} from 'esbuild';
import {mkdir,readdir,readFile,writeFile,cp,rm} from 'node:fs/promises';
import path from 'node:path';
await mkdir('build',{recursive:true});await viteBuild({root:'web',build:{outDir:'../build/client',emptyOutDir:true}});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain'};const assets={};
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else assets['/'+path.relative('build/client',p)]={data:(await readFile(p)).toString('base64'),type:types[path.extname(p)]||'application/octet-stream'}}}await walk('build/client');await writeFile('build/assets.json',JSON.stringify(assets));
await rm('dist',{recursive:true,force:true});await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});await build({entryPoints:['server/worker.mjs'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});await cp('.openai/hosting.json','dist/.openai/hosting.json');await cp('drizzle','dist/.openai/drizzle',{recursive:true});console.log('BURA Worker and migrations ready.');
