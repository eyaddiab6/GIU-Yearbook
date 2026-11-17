# تشغيل مشروع GIU Yearbook — Lab 7

ده **مش مجرد ملفات starter**؛ ده مشروع Angular كامل مستقل اتجمع بناءً على ملف تعليمات Lab 7 والـ ZIP اللي اترفَع. علشان الملفات الأصلية لمشروع Labs 1–6 والصور الأصلية مش مرفقة، أعدت تجهيز الصفحات المطلوبة، وحطيت صور توضيحية محلية بدل ما تظهر صور مكسورة.

## خطوات التشغيل (Windows / VS Code)

1. فك ضغط `GIU-Yearbook-Lab7-Complete.zip`.
2. افتح فولدر `GIU-Yearbook-Lab7` في VS Code.
3. افتح Terminal جوه نفس الفولدر، واكتب:

```powershell
npm install
npm start
```

4. افتح من المتصفح: <http://localhost:4200>

**بيانات الحساب التجريبي:**

- Email: `mock.user@student.giu-uni.de`
- Password: `password123`

## اختبر المطلوب في اللاب

- افتح **Student login**، وجرب Login فاضي → تظهر رسائل Validation.
- سجل بكلمة مرور غلط → تظهر رسالة Wrong username or password.
- سجل بالبيانات الصحيحة → هتدخل `/profile`، والهيدر هيقول My Profile.
- من DevTools > Network > Login هتلاقي `Set-Cookie` وفيها `HttpOnly`.
- لو فعلت **Keep me signed in** الكوكي هتفضل 7 أيام، وإلا هتبقى Session cookie.
- عدّل quote/story → Live preview وعداد الحروف بيتغيروا؛ الحالة هتبقى Unsaved changes.
- اختار **Save draft** → افتح Application > Local Storage، هتلاقي `giu:story-draft:1`؛ Reload ورجّع نفس الكلام.
- احذف cookie باسم `giu_session` وبعدها Reload على `/profile` → تتحول `/login`.
- **Publish profile** إضافة تجريبية: تتطلب quote صالح و consent، والبيانات المنشورة بتفضل طول ما الـ mock server شغال؛ لو قفلته وفتحته من جديد بتتصفّر.

## أوامر الاختبار

```powershell
npm test               # فحص الملفات والمسارات والأصول محلياً
npm run build:dev      # Build حقيقي (بعد npm install)
npm run test:api       # في Terminal ثاني بعد تشغيل npm start
```

**ملاحظات مهمة:**

- `node_modules` مش موجودة داخل الـ ZIP، لازم تشغل `npm install` أول مرة.
- الـ Angular build محتاج اتصال بـ npm؛ الفحص المحلي للملفات نجح، لكن البناء النهائي مش متحقق منه في بيئة التسليم بسبب عدم توفر الوصول لـ npm registry.
- الصور الموجودة توضيحية وبديلة، مش صور الطلاب الأصلية من التصميم.
- اختيار صورة من البروفايل حاليًا Preview فقط، مش Upload حقيقي للـ backend.
- ده مشروع تدريبي بالـ Mock API وليس نظام مصادقة آمن للإنتاج.
