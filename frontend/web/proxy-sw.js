const query = location.search.slice(1)
const API_URL = query.split('=')[1]

self.addEventListener('fetch', e => {
  const request = e.request;
  if(request.url.includes('/messenger')){
    const prefix = request.url.split('/messenger')[0]
    const url = request.url.replace(prefix, API_URL);
    const bodyP = request.headers.get('Content-Type') ? request.blob() : Promise.resolve(undefined);
    const fetchP = bodyP.then(body=>{
      const _request = new Request(url, {
        method: request.method,
        headers: request.headers,
        body: body,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        integrity: request.integrity,
      })
      return fetch(_request)
    })
    e.respondWith(fetchP)
  }
  else{
    e.respondWith(fetch(request))
  }
});
