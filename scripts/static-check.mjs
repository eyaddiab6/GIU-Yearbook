/* Dependency-free checks; this is NOT an Angular compilation test. */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname, extname } from 'node:path';
const base = resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(join(base,p), 'utf8');
const assert = (condition, message) => { if(!condition) throw new Error(message); };
const walk = (dir) => readdirSync(join(base,dir), {withFileTypes:true}).flatMap((item) => {
  const relative=join(dir,item.name);
  return item.isDirectory() ? walk(relative) : [relative];
});
let checks=0;
const okay=(test,msg)=>{ assert(test,msg); checks++; console.log('✓',msg); };
const packageJson=JSON.parse(read('package.json'));
const angular=JSON.parse(read('angular.json'));
const tsconfig=JSON.parse(read('tsconfig.json'));
okay(packageJson.scripts.start === 'ng serve','Angular start command');
okay(!!angular.projects['giu-yearbook-lab7'],'Angular application workspace');
okay(tsconfig.compilerOptions.strict === true, 'strict TypeScript configuration');
const sourceFiles=walk('src').filter((f)=>f.endsWith('.ts'));
for(const file of sourceFiles){
  const contents=read(file);
  for(const match of contents.matchAll(/\bfrom\s+['"](\.[^'"]+)['"]/g)){
    const target=resolve(base,dirname(file),match[1]);
    okay(['.ts','.tsx','.json',''].some((ext)=>existsSync(target+ext)) || existsSync(join(target,'index.ts')),`${file}: import ${match[1]} exists`);
  }
}
const login=read('src/app/pages/login-page/login-page.html');
const profile=read('src/app/pages/profile-page/profile-page.html');
const service=read('src/app/services/story-draft.service.ts');
const auth=read('src/app/services/auth.service.ts');
const server=read('src/mock-api/mock-auth.ts');
okay(login.includes('[formGroup]="form"') && login.includes('formControlName="email"') && login.includes('formControlName="password"'), 'reactive login form bindings');
okay(login.includes('(ngSubmit)="onSubmit()"') && login.includes('errorMessage()'), 'login submit and server error message');
okay(auth.includes('private readonly _currentUser') && auth.includes('asReadonly()'), 'private auth signal');
okay(server.includes('httpOnly: true') && server.includes('sameSite: \'lax\''), 'real mock HttpOnly cookie');
okay(profile.includes('formControlName="quote"') && profile.includes('formControlName="story"') && profile.includes('values().quote'), 'profile bindings and live preview');
okay(service.includes('JSON.stringify') && service.includes('JSON.parse') && service.includes('giu:story-draft:'), 'local storage JSON draft handling');
okay(walk('src/app').filter(f=>f.endsWith('.ts') && !f.endsWith('story-draft.service.ts')).every(f=>!read(f).includes('localStorage')), 'all localStorage usage lives only in StoryDraftService');
const btags=[...profile.matchAll(/<button\b[^>]*>/g)];
okay(btags.length>=3 && btags.every(([tag])=>tag.includes('type="button"')), 'profile buttons all have type=button');
for(const template of ['login-page','profile-page']){
  const file=`src/app/pages/${template}/${template}.html`;
  const html=read(file);
  for(const src of html.matchAll(/\bsrc="(icons\/[^" ]+|images\/[^" ]+)"/g)){
    okay(existsSync(join(base,'public',src[1])),`${file}: asset ${src[1]} exists`);
  }
}
const students=JSON.parse(read('src/mock-api/students.json'));
const staff=JSON.parse(read('src/mock-api/staff.json'));
for(const person of [...students,...staff]){
  okay(existsSync(join(base,'public',person.photo)),`${person.name}: local portrait exists`);
}
console.log(`\n${checks} static checks passed. Run npm install and npm run build:dev for a real Angular compilation check.`);
