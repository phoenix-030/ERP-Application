# EduConnect (Student ERP) — Full Flow Map

**Project:** STUDENT-ERP · **Stack:** Expo SDK 55, React Native, Expo Router  
**Generated for:** Architecture & onboarding documentation

---

## 1. Master system map

```
┌─────────────────────────────────────────────────────────────┐
│                    PHONE / WEB (UI)                          │
│  Screens (src/app) → Components → AuthContext                │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              BUSINESS LOGIC (Services)                       │
│  authService          studentService                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│           AsyncStorage (on device)                           │
│  educonnect_users  |  @educonnect_session  |                 │
│  educonnect_student_data                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. App entry → first screen (cold start)

| Step | Where | What | Why |
|------|--------|------|-----|
| 1 | `expo-router/entry` | Boots router | Expo entry point |
| 2 | `src/app/_layout.tsx` | AuthProvider + Stack | Global auth state |
| 3 | `AuthContext` hydrate | `restoreSession()` | Stay logged in after restart |
| 4 | `src/app/index.tsx` | Route `/` | App landing |
| 5 | `SplashScreen.tsx` | Animation 1.5s | Branding + wait for auth |
| 6a | If `user` exists | `router.replace(/student \| /staff \| /admin)` | Role home |
| 6b | If no user | `router.replace(/login)` | Auth screens |

**Flow:**

```
OPEN APP → AuthProvider hydrate → read session from AsyncStorage
         → Splash waits until isLoading=false + 1.5s delay
         → user? → role home : /login
```

---

## 3. Complete route map (all URLs)

### Public (auth group)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.tsx` + `SplashScreen` | Splash |
| `/login` | `(auth)/login.tsx` | Sign in |
| `/signup` | `(auth)/signup.tsx` | Register |

### Student (5 tabs)

| Route | File |
|-------|------|
| `/student` | `student/index.tsx` — Home |
| `/student/attendance` | `student/attendance.tsx` |
| `/student/marks` | `student/marks.tsx` |
| `/student/timetable` | `student/timetable.tsx` |
| `/student/profile` | `student/profile.tsx` → ProfileView |

### Staff (5 tabs)

| Route | File |
|-------|------|
| `/staff` | `staff/index.tsx` — Home |
| `/staff/mark-attendance` | `staff/mark-attendance.tsx` |
| `/staff/upload-marks` | `staff/upload-marks.tsx` |
| `/staff/assignments` | `staff/assignments.tsx` |
| `/staff/profile` | `staff/profile.tsx` → ProfileView |

### Admin (2 tabs)

| Route | File |
|-------|------|
| `/admin` | `admin/index.tsx` — Dashboard |
| `/admin/profile` | `admin/profile.tsx` → ProfileView |

---

## 4. Authorization (route guards)

Every role folder has a `_layout.tsx` that runs **before** any child screen.

### Auth layout `(auth)/_layout.tsx`

- If `user` exists → redirect to `getHomeRoute(role)` (`/student`, `/staff`, or `/admin`)
- Else → show login/signup stack

### Student / Staff / Admin layouts

```
isLoading?     → show spinner
!user?         → Redirect /login
wrong role?    → Redirect to correct role home
else           → show bottom tabs
```

**Example:** Logged-in student opens `/staff` → redirected to `/student`.

**Helper:** `src/lib/roleRoutes.ts` → `getHomeRoute(role)`

---

## 5. Sign up flow

1. User opens `/signup`, fills form, selects role (student / staff / admin).
2. Validates: required fields, email format, passwords match.
3. `AuthContext.signUp()` → `authService.signUp()`.
4. **Student:** `loginId` = Student ID. **Staff/Admin:** `loginId` stored as email.
5. Password hashed (SHA-256 via `expo-crypto`).
6. User appended to `educonnect_users` in AsyncStorage.
7. Success alert → navigate to `/login` (no auto-login).

---

## 6. Sign in flow

1. User opens `/login`, picks role tab.
2. **Student:** enters Student ID. **Staff/Admin:** enters email.
3. `signIn(identifier, password, role, rememberMe)`.
4. `authService` finds user by role + ID or email.
5. `verifyPassword()` compares hash.
6. Session created: UUID token, `userId`, `role`, `expiresAt`.
   - Remember me OFF → 24 hours
   - Remember me ON → 30 days
7. Session saved to `@educonnect_session`.
8. `setUser` in context → `router.replace(getHomeRoute(role))`.

---

## 7. Session restore & sign out

### Restore (every app start)

1. Read `@educonnect_session`
2. If expired → clear session, user = null
3. If valid → find user in `educonnect_users` by `session.userId`
4. If user missing → clear session
5. Else → set `user` in AuthContext

### Sign out (ProfileView)

1. `signOut()` → `clearSession()`
2. `setUser(null)`
3. `router.replace('/login')`

---

## 8. Profile update flow

1. User opens Profile tab (any role).
2. `ProfileView` loads fields from `user`.
3. Edit → Save → `updateProfile(updates)`.
4. `authService` merges into `educonnect_users`.
5. Context `user` updated.

---

## 9. Student role — screen flow

```
/student (Home)
  ├─ Reads getStudentRecordByUserId(user.id) from studentService
  ├─ Data from educonnect_student_data (per student id)
  │
  ├─ Tab: Attendance  → static mock UI (not from storage yet)
  ├─ Tab: Marks       → static mock UI
  ├─ Tab: Timetable   → static mock UI
  └─ Tab: Profile     → ProfileView (auth storage)
```

---

## 10. Staff role — screen flow

```
/staff (Home) — welcome UI, useAuth for name
  ├─ Mark Attendance  → local toggle list → Alert "Saved" (not persisted to studentService yet)
  ├─ Upload Marks     → form → Alert "Success" (not persisted yet)
  ├─ Assignments      → UI mock
  └─ Profile          → ProfileView
```

**Planned wiring:** `studentService.addAttendanceRecord`, `addMarkRecord`, `addAssignmentRecord`.

---

## 11. Admin role — screen flow

```
/admin (Dashboard) — static stats, charts, notices (mock data)
  └─ Profile → ProfileView
```

---

## 12. Data layer (AsyncStorage keys)

| Key | Contents | Written by | Read by |
|-----|----------|------------|---------|
| `educonnect_users` | All accounts (id, role, name, email, loginId, passwordHash, profile) | signUp, updateProfile | signIn, restoreSession, studentService |
| `@educonnect_session` | token, userId, role, expiresAt | signIn | restoreSession, signOut |
| `educonnect_student_data` | Map: studentId → { attendance[], marks[], assignments[] } | studentService add* functions | getStudentRecordByUserId (student home) |

---

## 13. Layer stack (how a tap travels)

```
User taps "Sign In"
  → login.tsx
  → useAuth().signIn
  → AuthContext
  → authService.signIn
  → authStorage → AsyncStorage
  → setUser
  → router.replace(/student)
  → student/_layout.tsx (guard)
  → Student tabs visible
```

---

## 14. File responsibility map

| File | Role |
|------|------|
| `src/app/_layout.tsx` | Root AuthProvider + Stack |
| `src/app/index.tsx` | Splash route |
| `src/app/(auth)/_layout.tsx` | Redirect if already logged in |
| `src/app/(auth)/login.tsx` | Login UI |
| `src/app/(auth)/signup.tsx` | Signup UI |
| `src/app/student/_layout.tsx` | Student guard + tabs |
| `src/app/staff/_layout.tsx` | Staff guard + tabs |
| `src/app/admin/_layout.tsx` | Admin guard + tabs |
| `src/components/SplashScreen.tsx` | Splash + redirect logic |
| `src/components/ProfileView.tsx` | Profile edit + logout |
| `src/context/AuthContext.tsx` | Global user state |
| `src/services/authService.ts` | Auth business rules |
| `src/services/authStorage.ts` | Users + session I/O |
| `src/services/studentService.ts` | Attendance, marks, assignments |
| `src/lib/roleRoutes.ts` | Role → home URL |
| `src/lib/password.ts` | Password hashing |
| `src/types/auth.ts` | Auth TypeScript types |
| `src/types/student.ts` | Student data types |

---

## 15. Wired vs mock (status)

| Feature | Status |
|---------|--------|
| Login / signup / session / logout | **Wired** |
| Role-based route guards | **Wired** |
| Profile edit | **Wired** |
| Student home from studentService | **Wired** (empty until data added) |
| Staff attendance / marks / assignments | **UI + alerts only** |
| Student attendance / marks / timetable | **Static mock** |
| Admin dashboard | **Static mock** |
| Real backend API | **Not present** |

---

## 16. Life of the app (one-page summary)

```
OPEN APP → restore session → Splash → login OR role home

LOGIN → validate → save session → role tabs

SIGNUP → save user → go to login

INSIDE ROLE → layout checks role → tabs → screens

SIGN OUT → clear session → login
```

---

*EduConnect — College Management System · Mock local auth for development only.*
