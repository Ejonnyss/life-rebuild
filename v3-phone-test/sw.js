const PREFIX='life-rebuild-'+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+'6d4cbcf707fb';
const ASSETS=["./","./OFL-Onest.txt","./apple-touch-icon.png","./assets/Onest-variable-DZuv1oNk.ttf","./assets/action-v32-C-F39Sv6.webp","./assets/backup-DqP-DSs4.js","./assets/city-v32-CHi9ZwHa.webp","./assets/index-B1bXc0nO.css","./assets/index-DwWkGsyN.js","./assets/map-v32-CIU3DbCG.webp","./assets/outcome-v32-5rNcZwfn.webp","./assets/stage-v32-CnwGdS3e.webp","./assets/traveler-v32-D3ERStxz.webp","./beta-week.html","./icon-192.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest","./videos/01-city-entry.mp4","./videos/02-financial-clarity.mp4","./videos/03-career-action.mp4","./videos/04-resource-pause.mp4","./videos/05-music-creation.mp4","./videos/06-body-threshold.mp4","./videos/07-team-work.mp4","./videos/08-route-threshold.mp4","./videos/09-waiting.mp4","./videos/10-relationships-initiative.mp4","./videos/11-driving-check.mp4","./videos/12-confirmed-outcome.mp4","./videos/hero-fullbody.mp4","./videos/portrait-focused.mp4","./videos/portrait-low-resource.mp4","./videos/portrait-neutral.mp4"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
async function mediaResponse(request){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request.url,{ignoreVary:true});
  if(cached){
    const range=request.headers.get('range');
    if(!range)return cached;
    const blob=await cached.blob();
    const match=/^bytes=(\d*)-(\d*)$/.exec(range);
    if(match){
      const start=match[1]?Number(match[1]):Math.max(0,blob.size-Number(match[2]));
      const end=match[1]&&match[2]?Math.min(Number(match[2]),blob.size-1):blob.size-1;
      if(start<blob.size&&end>=start)return new Response(blob.slice(start,end+1),{status:206,headers:{'Content-Type':cached.headers.get('Content-Type')||'video/mp4','Content-Length':String(end-start+1),'Content-Range':`bytes ${start}-${end}/${blob.size}`,'Accept-Ranges':'bytes'}});
      return new Response(null,{status:416,headers:{'Content-Range':`bytes */${blob.size}`}});
    }
  }
  try{const response=await fetch(request);if(response.status===200&&response.ok)cache.put(request.url,response.clone()).catch(()=>{});return response}catch{return cached||Response.error()}
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  if(new URL(event.request.url).pathname.endsWith('.mp4')){event.respondWith(mediaResponse(event.request));return}
  event.respondWith(fetch(event.request).then(response=>{if(response.ok&&response.status===200){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{})}return response}).catch(()=>caches.match(event.request,{ignoreVary:true}).then(cached=>cached||(event.request.mode==='navigate'?caches.match('./index.html',{ignoreVary:true}):Response.error()))))
});
