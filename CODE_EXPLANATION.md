# 📖 Dev Blog Jay - 상세 코드 설명서

초보자를 위한 **라인별 코드 설명 + 함수/컴포넌트별 상세 가이드**

---

## 📑 목차

1. [Entry Point](#1-entrypoint--main-tsx)
2. [App 컴포넌트](#2-app-컴포넌트--app-tsx)
3. [Firebase 설정](#3-firebase-설정--firebase-ts)
4. [인증 함수들](#4-인증-함수--auth-ts)
5. [타입 정의](#5-타입-정의--types-ts)
6. [Header 컴포넌트](#6-header-컴포넌트--header-tsx)
7. [MainLayout](#7-메인-레이아웃--mainlayout-tsx)
8. [로그인 페이지](#8-로그인-페이지--loginpage-tsx)
9. [홈페이지](#9-홈페이지--homepage-tsx)

---

## 1. Entry Point | main.tsx

### 📄 파일 위치
`src/main.tsx`

### 🎯 역할
React 앱을 실행하는 **가장 처음의 코드**

### 💻 전체 코드

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 🔍 라인별 설명

| 라인 | 코드 | 설명 |
|------|------|------|
| 1 | `import { StrictMode } from 'react'` | React에서 StrictMode를 가져옵니다. 개발 중 문제를 찾기 위한 도구입니다. |
| 2 | `import { createRoot } from 'react-dom/client'` | React 앱을 DOM에 그리기 위한 함수를 가져옵니다. |
| 3 | `import './index.css'` | 전역 CSS 스타일을 로드합니다. |
| 4 | `import App from './App.tsx'` | 메인 App 컴포넌트를 가져옵니다. |
| 6 | `createRoot(document.getElementById('root')!)` | HTML의 `<div id="root"></div>`를 찾아 React 루트를 생성합니다. |
| 7-10 | `.render(...)` | App 컴포넌트를 StrictMode로 감싸서 렌더링합니다. |

### 📚 개념 설명

#### createRoot란?
```
HTML 문서 (index.html)
    ↓
    <div id="root"></div>  ← 여기를 찾음
    ↓
React가 여기에 모든 것을 그림
```

#### StrictMode란?
- 개발 중 잠재적 문제를 찾아주는 도구
- 콘솔에 경고를 표시
- 프로덕션 빌드에서는 자동으로 제거됨

---

## 2. App 컴포넌트| App.tsx

### 📄 파일 위치
`src/App.tsx`

### 🎯 역할
**전체 앱의 중추**
- 페이지 라우팅 설정 (어떤 URL에서 어떤 페이지를 보여줄지)
- 인증 상태 관리 (사용자가 로그인했는지 감지)

### 💻 전체 코드 분석

```tsx
// src/App.tsx

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { subscribeToAuthState } from "./lib/auth";
import type { User } from "./types";

import MainLayout from "@/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";

function App() {
    // ❶ 상태 정의
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // ❷ 인증 상태 감지
    useEffect(() => {
        const unsubscribe = subscribeToAuthState((user) => {
            setUser(user);
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ❸ 로딩 중 UI
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    // ❹ 라우팅 설정
    return (
        <BrowserRouter>
            <Routes>
                {/* 레이아웃이 적용되는 라우트 */}
                <Route element={<MainLayout user={user} />}>
                    <Route path="/" element={<HomePage />} />
                </Route>

                {/* 레이아웃 없이 표시되는 인증 페이지 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
```

### 🔍 섹션별 상세 설명

#### ❶ 상태 정의 (14-15줄)

```tsx
const [user, setUser] = useState<User | null>(null);
const [isAuthLoading, setIsAuthLoading] = useState(true);
```

**설명**:
- `user` - 현재 로그인한 사용자 정보 (처음엔 null)
- `setUser()` - user를 변경할 수 있는 함수
- `isAuthLoading` - Firebase에서 인증 상태를 가져오는 중인지 여부
- `<User | null>` - TypeScript 타입 (User 객체 또는 null)

**비유**:
```
state = 우리 앱의 "기억력"
- user: "지금 로그인한 사람은 누구?"
- isAuthLoading: "지금 로그인 정보를 확인 중인가?"
```

---

#### ❷ 인증 상태 감지 (18-25줄)

```tsx
useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
        setUser(user);
        setIsAuthLoading(false);
    });

    return () => unsubscribe();
}, []);
```

**라인별 설명**:

| 라인 | 코드 | 의미 |
|------|------|------|
| 18 | `useEffect(() => {` | 컴포넌트가 처음 나타날 때 한 번 실행 |
| 19-22 | `subscribeToAuthState(...)` | Firebase 인증 상태 변화를 감시하기 시작 |
| 21 | `setUser(user)` | 인증 상태 변경되면 user 업데이트 |
| 22 | `setIsAuthLoading(false)` | 로딩 완료 표시 |
| 24-25 | `return () => unsubscribe()` | 컴포넌트 제거될 때 감시 중지 |
| 26 | `}, []` | 빈 의존성 = 최초 1회만 실행 |

**흐름 다이어그램**:
```
App 컴포넌트 시작
    ↓
useEffect 실행 (처음 1회만)
    ↓
Firebase와 연결: "사용자 정보 주세요"
    ↓
Firebase가 응답 (로그인됨 / 로그아웃됨)
    ↓
user 상태 업데이트
    ↓
컴포넌트 다시 렌더링
```

---

#### ❸ 로딩 중 UI (28-38줄)

```tsx
if (isAuthLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
        </div>
    );
}
```

**설명**:
- Firebase에서 인증 상태를 받기 전에 로딩 화면 표시
- 스핀 애니메이션 (돌아가는 원)
- 사용자에게 "기다려주세요"라는 신호

---

#### ❹ 라우팅 설정 (41-54줄)

```tsx
return (
    <BrowserRouter>
        <Routes>
            {/* 레이아웃이 적용되는 라우트 */}
            <Route element={<MainLayout user={user} />}>
                <Route path="/" element={<HomePage />} />
            </Route>

            {/* 레이아웃 없이 표시되는 인증 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Routes>
    </BrowserRouter>
);
```

**설명**:

| URL | 표시할 것 | 특징 |
|-----|----------|------|
| `/` | HomePage (+ MainLayout) | 헤더, 푸터 있음 |
| `/login` | LoginPage | 헤더, 푸터 없음 |
| `/signup` | SignUpPage | 헤더, 푸터 없음 |

**비유**:
```
BrowserRouter = 네비게이션 시스템
Routes = 지도
Route = 각 목적지
  - path: 주소
  - element: 그곳에 표시할 화면
```

---

## 3. Firebase 설정 | firebase.ts

### 📄 파일 위치
`src/lib/firebase.ts`

### 🎯 역할
Firebase와 우리 앱을 **연결하는 다리**

### 💻 전체 코드

```typescript
// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase 설정 객체
 * 
 * 환경 변수에서 값을 가져옵니다.
 * import.meta.env는 Vite에서 환경 변수에 접근하는 방식입니다.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Firebase 앱 초기화
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication 인스턴스
 */
export const auth = getAuth(app);

/**
 * Cloud Firestore 인스턴스
 */
export const db = getFirestore(app);

/**
 * Firebase 앱 인스턴스 내보내기
 */
export default app;
```

### 🔍 상세 설명

#### 환경 변수란?
```
.env.local 파일에 저장된 민감한 정보
예: API KEY, 비밀번호 등

import.meta.env.VITE_FIREBASE_API_KEY
  ↓
.env.local의 VITE_FIREBASE_API_KEY 값을 읽음
```

#### 세 가지 export

| Export | 목적 | 사용 예시 |
|--------|------|----------|
| `export const auth` | 로그인/회원가입 | `signIn(auth, email, password)` |
| `export const db` | 데이터베이스 | `getDoc(db, 'posts/doc-id')` |
| `export default app` | Firebase 전체 | 특수 기능이 필요할 때 |

---

## 4. 인증 함수 | auth.ts

### 📄 파일 위치
`src/lib/auth.ts`

### 🎯 역할
회원가입, 로그인, 로그아웃 등의 **인증 로직을 모아둔 도구함**

### 💻 함수별 상세 설명

#### 함수 1️⃣: formatUser()

```typescript
/**
 * Firebase User를 우리 앱의 User 타입으로 변환
 */
export function formatUser(firebaseUser: FirebaseUser): User {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
    };
}
```

**설명**:
- Firebase가 제공하는 user 객체를 우리가 원하는 형태로 변환
- 필요한 필드만 골라서 새로운 객체 생성

**비유**:
```
Firebase User (원본)          우리의 User (가공된 형태)
  ├─ uid                       ├─ uid
  ├─ email                     ├─ email
  ├─ displayName               ├─ displayName
  ├─ photoURL                  ├─ photoURL
  ├─ metadata
  ├─ reloadUserInfo
  └─ ... (기타 많은 정보)   
```

---

#### 함수 2️⃣: signUp() - 회원가입

```typescript
/**
 * 이메일/비밀번호로 회원가입
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호 (6자 이상)
 * @returns 생성된 사용자 정보
 * @throws 이미 가입된 이메일, 약한 비밀번호 등의 에러
 */
export async function signUp(
  email: string, 
  password: string
): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );
    return formatUser(userCredential.user);
}
```

**라인별 분석**:

| 부분 | 설명 |
|------|------|
| `async function` | 시간이 걸리는 작업 (네트워크 요청) |
| `email: string, password: string` | 입력받을 데이터 |
| `Promise<User>` | 결과는 User 객체를 반환한다는 뜻 |
| `await createUserWithEmailAndPassword()` | Firebase 서버에 가입 요청 |
| `formatUser()` | Firebase 응답을 우리 형식으로 변환 |

**흐름**:
```
1. 사용자가 이메일, 비밀번호 입력
   ↓
2. signUp(email, password) 호출
   ↓
3. Firebase 서버로 요청 전송
   ↓
4. 서버가 계정 생성 (또는 에러 반환)
   ↓
5. 결과를 User 형식으로 변환해서 반환
```

---

#### 함수 3️⃣: signIn() - 로그인

```typescript
/**
 * 이메일/비밀번호로 로그인
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 * @returns 로그인한 사용자 정보
 * @throws 존재하지 않는 사용자, 잘못된 비밀번호 등의 에러
 */
export async function signIn(
  email: string, 
  password: string
): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
    );
    return formatUser(userCredential.user);
}
```

**signUp과의 차이**:

| 함수 | Firebase 함수 | 작업 |
|------|--------------|------|
| signUp | `createUserWithEmailAndPassword` | 새 계정 **생성** |
| signIn | `signInWithEmailAndPassword` | 기존 계정 **확인** |

---

#### 함수 4️⃣: logout() - 로그아웃

```typescript
/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
    await signOut(auth);
}
```

**설명**:
- 매우 간단함
- Firebase에서 "이 사용자 세션 종료" 신호
- 반환값 없음 (`Promise<void>`)

---

#### 함수 5️⃣: subscribeToAuthState() - 상태 감지

```typescript
/**
 * 인증 상태 변경 감지
 *
 * Firebase Auth의 onAuthStateChanged를 래핑합니다.
 * 로그인/로그아웃 시, 또는 페이지 새로고침 시 호출됩니다.
 *
 * @param callback - 인증 상태 변경 시 호출될 함수
 * @returns 구독 해제 함수 (cleanup)
 */
export function subscribeToAuthState(
    callback: (user: User | null) => void,
): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            callback(formatUser(firebaseUser));
        } else {
            callback(null);
        }
    });
}
```

**설명**:

| 부분 | 설명 |
|------|------|
| `callback: (user: User \| null) => void` | 상태 변경 시 실행할 함수 |
| `onAuthStateChanged()` | Firebase 인증 상태 감시 시작 |
| `if (firebaseUser)` | 로그인 상태면 formatUser() 호출 |
| `else callback(null)` | 로그아웃 상태면 null 전달 |
| `return () => void` | 감시를 멈추는 함수 반환 |

**사용 예시**:
```typescript
// App.tsx에서 사용
const unsubscribe = subscribeToAuthState((user) => {
    setUser(user);  // user 상태 업데이트
    setIsAuthLoading(false);
});

// 정리할 때 호출
return () => unsubscribe();
```

---

#### 함수 6️⃣: getAuthErrorMessage() - 에러 메시지

```typescript
/**
 * Firebase Auth 에러 메시지를 사용자 친화적인 한글로 변환
 */
export function getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
        "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
        "auth/invalid-email": "올바른 이메일 형식을 입력해주세요.",
        "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
        "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
        "auth/too-many-requests": "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
        "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
        "auth/internal-error": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };

    return errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다.";
}
```

**설명**:
- Firebase 에러 코드를 사람이 읽기 좋은 한글 메시지로 변환
- 없는 코드면 기본 메시지 반환

**사용 예시**:
```typescript
try {
    await signIn(email, password);
} catch (err) {
    const message = getAuthErrorMessage(err.code);
    setError(message);  // UI에 표시
}
```

---

## 5. 타입 정의 | types/index.ts

### 📄 파일 위치
`src/types/index.ts`

### 🎯 역할
TypeScript 타입을 **중앙에서 관리**하는 곳

### 💻 주요 타입 설명

#### 1️⃣ User 타입 - 사용자 정보

```typescript
/**
 * 사용자 정보 타입
 */
export interface User {
  /** Firebase Auth에서 자동 생성되는 고유 ID */
  uid: string;
  
  /** 사용자 이메일 (로그인 ID로 사용) */
  email: string;
  
  /** 표시 이름 (소셜 로그인 시 가져옴, 없으면 null) */
  displayName: string | null;
  
  /** 프로필 이미지 URL (소셜 로그인 시 가져옴) */
  photoURL: string | null;
}
```

**사용 예시**:
```typescript
const user: User = {
    uid: "user-123",
    email: "user@email.com",
    displayName: "John Doe",
    photoURL: "https://..."
};
```

---

#### 2️⃣ Post 타입 - 게시글 정보

```typescript
/**
 * 게시글 타입
 */
export interface Post {
  id: string;                    // 문서 ID
  title: string;                 // 제목
  content: string;               // 본문
  category: Category | null;     // 카테고리
  authorId: string;              // 작성자 UID
  authorEmail: string;           // 작성자 이메일
  authorDisplayName: string | null;  // 작성자 이름
  createdAt: Timestamp;          // 작성 시간
  updatedAt: Timestamp;          // 수정 시간
}
```

**데이터베이스 구조**:
```
Firestore
└─ posts (컬렉션)
   ├─ post-001
   │  ├─ title: "React 배우기"
   │  ├─ content: "..."
   │  ├─ authorId: "user-123"
   │  └─ createdAt: 2024-02-03
   └─ post-002
      ├─ title: "TypeScript 팁"
      └─ ...
```

---

#### 3️⃣ Category 타입 - 카테고리

```typescript
/**
 * 게시글 카테고리 타입
 */
export type Category = 
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'firebase'
  | 'etc';

/**
 * 카테고리 한글 라벨
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  firebase: 'Firebase',
  etc: '기타',
};
```

**사용 예시**:
```typescript
const category: Category = 'react';  // O (올바름)
const category: Category = 'python';  // X (오류!)

CATEGORY_LABELS['react']  // 'React'
```

---

#### 4️⃣ Form 타입들

```typescript
/**
 * 로그인 폼 데이터
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 회원가입 폼 데이터
 */
export interface SignUpFormData {
  email: string;
  password: string;
  passwordConfirm: string;
}
```

**사용 예시**:
```typescript
const loginData: LoginFormData = {
    email: "user@email.com",
    password: "password123"
};
```

---

## 6. Header 컴포넌트| Header.tsx

### 📄 파일 위치
`src/components/Header.tsx`

### 🎯 역할
상단 네비게이션 바
- 로그인 상태에 따라 다른 버튼 표시

### 💻 전체 코드

```tsx
// src/components/Header.tsx

import { Link } from "react-router-dom";
import { logout } from "@/lib/auth";
import type { User } from "@/types";

interface HeaderProps {
    user: User | null;
}

function Header({ user }: HeaderProps) {
    // ❶ 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* ❷ 로고 */}
                    <Link to="/" className="text-xl font-bold text-gray-900">
                        📝 My Dev Blog
                    </Link>

                    {/* ❸ 조건부 렌더링: 로그인 상태에 따라 다른 UI */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            // ✅ 로그인 상태
                            <>
                                <span className="text-sm text-gray-600">
                                    {user.displayName || user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            // ❌ 로그아웃 상태
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    가입하기
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
```

### 🔍 섹션별 상세 설명

#### ❶ Props 정의

```tsx
interface HeaderProps {
    user: User | null;
}

function Header({ user }: HeaderProps) {
```

**설명**:
- 부모 (MainLayout)에서 `user` props를 받음
- `{}` 문법 = 구조 분해 (destructuring)

**비유**:
```
받은 props (부모에서 전달)
{
    user: { uid: "123", email: "..." }
}
    ↓ 구조 분해
{ user } = props
    ↓
user 변수 사용 가능
```

---

#### ❷ 로그아웃 핸들러

```tsx
const handleLogout = async () => {
    try {
        await logout();
    } catch (error) {
        console.error("로그아웃 실패:", error);
    }
};
```

**설명**:
- 로그아웃 버튼 클릭 시 실행될 함수
- `async/await` - 비동기 처리 (네트워크 요청 대기)
- `try/catch` - 에러 처리

---

#### ❸ 조건부 렌더링

```tsx
{user ? (
    // ✅ 로그인 상태
    <>
        <span>{user.displayName || user.email}</span>
        <button onClick={handleLogout}>로그아웃</button>
    </>
) : (
    // ❌ 로그아웃 상태
    <>
        <Link to="/login">로그인</Link>
        <Link to="/signup">가입하기</Link>
    </>
)}
```

**흐름**:
```
user가 있는가?
├─ YES (로그인됨) → 사용자 이름 + 로그아웃 버튼 표시
└─ NO (로그아웃됨) → 로그인/가입 버튼 표시
```

---

## 7. 메인 레이아웃 | MainLayout.tsx

### 📄 파일 위치
`src/layout/MainLayout.tsx`

### 🎯 역할
**모든 페이지의 공통 틀**
```
┌────────────────┐
│    Header      │  ← 항상 보임
├────────────────┤
│                │
│  Main Content  │  ← 페이지마다 달라짐
│  (Outlet)      │
│                │
├────────────────┤
│    Footer      │  ← 항상 보임
└────────────────┘
```

### 💻 전체 코드

```tsx
// src/layout/MainLayout.tsx

import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import type { User } from "@/types";

interface LayoutProps {
    user: User | null;
}

function Layout({ user }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 헤더 */}
            <Header user={user} />

            {/* 메인 콘텐츠 */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
                {/* ⭐ Outlet: 여기에 페이지가 들어옴 */}
                <Outlet />
            </main>

            {/* 푸터 */}
            <footer className="bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
                    © 2025 My Dev Blog. Built with React + Firebase
                </div>
            </footer>
        </div>
    );
}

export default Layout;
```

### 🔍 Outlet이란?

```tsx
<Outlet />
```

**설명**:
- React Router의 특수 컴포넌트
- "여기에 자식 라우트를 렌더링하세요"라는 뜻

**라우팅 구조**:
```
<Route element={<MainLayout user={user} />}>
    <Route path="/" element={<HomePage />} />
</Route>

↓ 결과

<MainLayout>
    <Header />
    <Outlet />  ← 여기에 <HomePage /> 삽입됨
    <Footer />
</MainLayout>
```

---

## 8. 로그인 페이지 | LoginPage.tsx

### 📄 파일 위치
`src/pages/LoginPage.tsx`

### 🎯 역할
이메일/비밀번호 로그인 폼

### 💻 핵심 코드

```tsx
import { type SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, getAuthErrorMessage } from "../lib/auth";

function LoginPage() {
    // ❶ 폼 입력값 상태
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // ❷ 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // ❸ 제출 핸들러
    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();  // 새로고침 방지
        setError(null);

        // 유효성 검사
        if (!email.trim() || !password.trim()) {
            setError("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            // ④ Firebase로 로그인
            await signIn(email, password);
            // ⑤ 성공 → 메인 페이지로 이동
            navigate("/");
        } catch (err: unknown) {
            // ⑥ 실패 → 에러 메시지 표시
            if (err && typeof err === "object" && "code" in err) {
                const firebaseError = err as { code: string };
                setError(getAuthErrorMessage(firebaseError.code));
            } else {
                setError("로그인 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);  // 로딩 상태 해제
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* 헤더 */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        📝 My Dev Blog
                    </h1>
                    <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                        로그인
                    </h2>
                </div>

                {/* 로그인 폼 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 이메일 입력 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>

                    {/* 가입 링크 */}
                    <p className="text-center text-sm text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                            가입하기
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
```

### 🔍 흐름 다이어그램

```
사용자가 이메일, 비밀번호 입력
    ↓
로그인 버튼 클릭
    ↓
handleSubmit 함수 실행
    ↓
    ├─ e.preventDefault() → 새로고침 방지
    ├─ 유효성 검사 (입력값 확인)
    └─ signIn() 호출 → Firebase 요청
    ↓
결과 처리
├─ ✅ 성공 → navigate("/") 메인 페이지로 이동
└─ ❌ 실패 → error 상태 업데이트, 에러 메시지 표시
```

---

## 9. 홈페이지 | HomePage.tsx

### 📄 파일 위치
`src/pages/HomePage.tsx`

### 🎯 역할
메인 페이지 (현재는 게시글 목록이 비어있음)

### 💻 전체 코드

```tsx
// src/pages/HomePage.tsx

/**
 * 홈 페이지 (게시글 목록)
 */
function HomePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    최신 게시글
                </h1>
            </div>

            {/* 게시글 목록 (Day 6에서 구현) */}
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">아직 게시글이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">
                    게시글 CRUD는 Day 6에서 구현합니다.
                </p>
            </div>
        </div>
    );
}

export default HomePage;
```

**설명**:
- 현재는 템플릿만 있음
- 나중에 여기에 게시글 목록을 불러와서 표시할 것

---

## 🎓 핵심 개념 정리

### ✅ State (상태)란?

```tsx
const [count, setCount] = useState(0);
        ↑          ↑          ↑
     상태명    상태변경함수   초기값
```

**특징**:
- 시간이 지나면서 변할 수 있는 데이터
- 변경되면 컴포넌트가 자동으로 다시 렌더링됨
- 상태 변경은 반드시 `setState()` 함수로만 가능

---

### ✅ Props란?

```tsx
// 부모 컴포넌트
<Header user={user} />
         ↑    ↑
      prop명  값

// 자식 컴포넌트
function Header({ user }) {
    // user를 사용 가능
}
```

**특징**:
- 부모 → 자식으로 전달하는 데이터
- 자식에서는 수정 불가능 (읽기만 가능)
- 부모의 state가 변경되면 자동으로 자식도 업데이트됨

---

### ✅ useEffect란?

```tsx
useEffect(() => {
    // 실행할 코드
    console.log("컴포넌트가 나타났습니다!");
}, []);  // 의존성 배열

의존성 배열:
- []  → 최초 1회만 실행
- [count]  → count가 변경될 때마다 실행
- 생략  → 매번 렌더링될 때마다 실행
```

---

### ✅ async/await란?

```tsx
// 시간이 걸리는 작업
async function login(email, password) {
    // 결과를 기다림
    const user = await Firebase요청();
    
    // 결과를 받은 후에 실행
    setUser(user);
}
```

**흐름**:
```
1. 네트워크 요청 시작
2. "기다려주세요..." ← await가 여기서 멈춤
3. 서버에서 응답
4. 다음 줄 실행
```

---

### ✅ 조건부 렌더링 ({} ? : )

```tsx
{user ? (
    // user가 있으면 이것을 렌더링
    <div>로그인됨</div>
) : (
    // 없으면 이것을 렌더링
    <div>로그아웃됨</div>
)}
```

---

## 🚀 다음 학습 단계

1. **각 컴포넌트 코드 복사하기** - 직접 타이핑하면서 이해
2. **변수명 바꿔보기** - `user` → `currentUser` 등으로 변경하고 전체 영향 확인
3. **스타일 수정해보기** - Tailwind 클래스 제거/추가해서 UI 변경
4. **새 페이지 만들기** - AboutPage.tsx 만들어서 라우팅 추가
5. **에러 메시지 읽기** - 실수하면 콘솔 에러를 정독하기

---

## 💡 디버깅 팁

### 1. 콘솔에 출력해보기
```tsx
console.log("user:", user);
console.log("isAuthLoading:", isAuthLoading);
```

### 2. React DevTools 사용
- Chrome 확장프로그램 설치
- F12 → Components 탭에서 컴포넌트/state 확인

### 3. 단계별 실행
```tsx
const handleSubmit = async (e) => {
    console.log("1. 폼 제출됨");
    e.preventDefault();
    console.log("2. preventDefault 실행됨");
    
    if (!email) {
        console.log("3. 이메일이 비어있음");
        return;
    }
    
    console.log("4. signIn 호출");
    await signIn(email, password);
    console.log("5. signIn 완료");
};
```

---

**이해가 안 되는 부분이 있으면 언제든지 물어보세요!** 🎓
