# Project Map & Explanation (PME)

## File Responsibility Map (Quick Reference)

| File                 | Role in Flow                         |
| -------------------- | ------------------------------------ |
| \_layout.tsx         | Root: AuthProvider + Stack           |
| index.tsx            | Route `/` → Splash                   |
| (auth)/\_layout.tsx  | Block login if already authenticated |
| (auth)/login.tsx     | Sign in UI                           |
| (auth)/signup.tsx    | Register UI                          |
| student/\_layout.tsx | Student guard + 5 tabs               |
| staff/\_layout.tsx   | Staff guard + 5 tabs                 |
| admin/\_layout.tsx   | Admin guard + 2 tabs                 |
| SplashScreen.tsx     | Splash animation + redirect          |
| AuthContext.tsx      | Global user state                    |
| authService.ts       | Auth rules                           |
| authStorage.ts       | Users + session I/O                  |
| studentService.ts    | Student ERP records                  |
| roleRoutes.ts        | Role → home URL                      |
| password.ts          | Hash passwords                       |
| ProfileView.tsx      | Profile + logout + edit              |
| types/auth.ts        | Auth types                           |
| types/student.ts     | Attendance/marks/assignment types    |

---

## Recent Additions

- Student signup now asks users to choose a department.
- Staff signup now asks users to choose the subject they teach.
- Staff profile now includes a selectable subject field.
- Auth data now stores department and subject metadata for signup/profile updates.

This table provides a quick reference for the main files in the project and their roles in the authentication and ERP flow. Use this as a guide for navigation and understanding the structure of the codebase.
