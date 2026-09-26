import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,relative} from 'node:path';
const root='dist';
async function files(dir){const entries=await readdir(dir,{withFileTypes:true});const results=await Promise.all(entries.map(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]));return results.flat()}
const html=await readFile(join(root,'index.html'));
const names=(await files(root)).filter(p=>!p.endsWith('/sw.js')).map(p=>'./'+relative(root,p).replaceAll('\\','/'));
names.unshift('./');
const hash=createHash('sha256').update(html).digest('hex').slice(0,12);
const template=await readFile('public/sw.js','utf8');
await writeFile(join(root,'sw.js'),template.replace('__CACHE__',hash).replace('__PRECACHE__',JSON.stringify(names)));
