# ⚡ Render Deployment - Quick Start (Roman Urdu)

## 🎯 **5 Minutes Mein Deploy Karo!**

### **Step 1: Render Account (2 min)**
```
1. https://render.com kholo
2. "Sign up with GitHub" click karo
3. Email verify karo
```

### **Step 2: Backend Service (2 min)**
```
1. Dashboard → "New +" → "Web Service"
2. GitHub repo select karo (mid-lab-devops)
3. Naam: blog-backend
4. Build: pip install -r Blog/requirements.txt
5. Start: cd Blog && gunicorn Blog.wsgi:application --bind 0.0.0.0:$PORT
6. "Create Web Service" click karo
```

### **Step 3: Environment Variables Backend (1 min)**
```
Backend Service mein:
Name: blog-backend
Environment → Add:
- DEBUG=False
- ALLOWED_HOSTS=blog-backend-xxxx.onrender.com
- DATABASE_URL=postgresql://...
- SECRET_KEY=generate-kuch-random
```

### **Step 4: PostgreSQL Database (1 min)**
```
1. Dashboard → "New +" → "PostgreSQL"
2. Name: blog-database
3. Create karo
4. Connection URL copy karo
5. Backend ke DATABASE_URL mein paste karo
```

### **Step 5: Frontend Service (1 min)**
```
1. Dashboard → "New +" → "Static Site"
2. GitHub repo select karo
3. Build Command: cd blog-frontend && npm install && npm run build
4. Publish: blog-frontend/build
5. Create karo
```

### **Step 6: Frontend Environment Variables (1 min)**
```
Frontend Service mein:
Environment → Add:
REACT_APP_API_URL=https://blog-backend-xxxx.onrender.com/api
```

---

## 🚀 **Ab Deploy Karo!**

```powershell
# 1. Locally push karo
git push origin main

# 2. GitHub Actions automatically chalega
# 3. Render automatically deploy karega
# 4. Done! ✅
```

---

## 📊 **Render Dashboard Navigation**

```
Render Home
├─ My Dashboard (Overview dekho)
├─ Web Services (Backend)
│  └─ blog-backend → Logs dekho
├─ PostgreSQL (Database)
│  └─ blog-database → Connection URL copy
└─ Static Sites (Frontend)
   └─ blog-frontend → Build logs dekho
```

---

## ✅ **Verification**

```
✅ Backend: https://blog-backend-xxxx.onrender.com
✅ Frontend: https://blog-frontend-xxxx.onrender.com
✅ Database: PostgreSQL connected
✅ CI/CD: Automatic deploy on main push
```

---

**Bilkul simple! Bas 5 minutes!** 🎉

