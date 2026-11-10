const base = 'http://localhost:5173';
const r = await fetch(base + '/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin: base },
  body: JSON.stringify({ email: 'admin@rw.id', password: 'admin123' })
});
console.log('status', r.status);
console.log('cookies', r.headers.getSetCookie());
console.log((await r.text()).slice(0, 400));
