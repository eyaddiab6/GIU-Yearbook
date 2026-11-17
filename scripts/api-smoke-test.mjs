/* Run in another terminal after `npm start` to test the mock server endpoints. */
import assert from 'node:assert/strict';
const base = process.env.APP_URL || 'http://localhost:4200';
const fetchJson=(url,opts={})=>fetch(base+url,opts);
const failed=await fetchJson('/mock-api/login',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({email:'mock.user@student.giu-uni.de',password:'wrongpassword'}),
});
assert.equal(failed.status,500); console.log('✓ Wrong password rejected');
const login=await fetchJson('/mock-api/login',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({email:'mock.user@student.giu-uni.de',password:'password123',remember:true}),
});
assert.equal(login.status,200);
const cookie=login.headers.get('set-cookie') || '';
assert.match(cookie,/giu_session=/);
assert.match(cookie,/httponly/i);
assert.match(cookie,/Max-Age=/i);
console.log('✓ HttpOnly seven-day cookie set');
const me=await fetchJson('/mock-api/me',{headers:{cookie}});
assert.equal(me.status,200);
assert.equal((await me.json()).studentId,1);
console.log('✓ Session restored with cookie');
const published=await fetchJson('/mock-api/publish',{
  method:'POST',headers:{'content-type':'application/json',cookie},
  body:JSON.stringify({quote:'A new memory.',story:'Hello from the yearbook',moment:'A campus day',next:'More discoveries',consent:true}),
});
assert.equal(published.status,200);
const people=await (await fetchJson('/mock-api/students.json')).json();
assert.equal(people[0].quote,'A new memory.');
console.log('✓ Profile can be published');
const logout=await fetchJson('/mock-api/logout',{method:'POST',headers:{cookie}});
assert.equal(logout.status,204);
console.log('✓ Logout clears cookie');
console.log('API smoke tests passed.');
