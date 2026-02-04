# 🚀 Dev Blog Jay - 프로젝트 가이드

초보자도 이해할 수 있는 프로젝트 구조 설명서입니다!

---

## 📚 프로젝트란?

이 프로젝트는 **개발 블로그** 웹사이트입니다.
- 사용자가 가입하고 로그인할 수 있습니다
- Firebase를 사용한 인증 (회원관리)
- React와 TypeScript로 만든 현대적인 웹앱

---

## 🛠️ 사용된 기술 스택

### 프론트엔드 (보이는 부분)
- **React 19** - 화면을 그리는 JavaScript 라이브러리
- **TypeScript** - 더 안전한 JavaScript (타입 체크)
- **React Router** - 페이지 이동 (링크 클릭했을 때)
- **Tailwind CSS** - 버튼, 색상 등을 쉽게 꾸미는 도구

### 백엔드 (서버/데이터)
- **Firebase** - Google의 클라우드 서비스
  - 인증 (로그인/회원가입)
  - 데이터베이스 (Firestore)

### 개발 도구
- **Vite** - 개발 서버 (빠른 개발)
- **TypeScript** - 코드 검사
- **ESLint** - 코드 품질 검사

---

## 📂 폴더 구조 설명

```
dev-blog-jay/
├── src/                    # 👈 우리가 작성하는 모든 코드
│   ├── main.tsx           # 앱 시작점 (React 앱 렌더링)
│   ├── App.tsx            # 메인 컴포넌트 (라우팅 설정)
│   ├── index.css          # 전역 스타일
│   │
│   ├── components/        # 재사용 가능한 작은 조각들
│   │   ├── Header.tsx     # 상단 네비게이션
│   │   ├── FirebaseStatus.tsx  # Firebase 상태 표시
│   │   └── StatusItem.tsx # 상태 아이템
│   │
│   ├── pages/             # 각 페이지들
│   │   ├── HomePage.tsx   # 메인 페이지
│   │   ├── LoginPage.tsx  # 로그인 페이지
│   │   └── SignUpPage.tsx # 회원가입 페이지
│   │
│   ├── layout/            # 페이지 레이아웃 (공통 틀)
│   │   └── MainLayout.tsx # 헤더+푸터+본문 구조
│   │
│   ├── lib/               # 유틸리티 함수들 (도구 모음)
│   │   ├── firebase.ts    # Firebase 초기화
│   │   └── auth.ts        # 인증 관련 함수
│   │
│   ├── types/             # TypeScript 타입 정의
│   │   └── index.ts       # User 등의 데이터 구조
│   │
│   └── assets/            # 이미지, 폰트 등
│
├── public/                # 정적 파일 (favicon 등)
│
├── package.json          # 프로젝트 정보 & 라이브러리 목록
├── vite.config.ts        # Vite 설정
├── tsconfig.json         # TypeScript 설정
└── README.md             # 프로젝트 설명
```

---

## 🎯 핵심 파일 설명

### 1️⃣ `src/main.tsx` - 앱 시작점
```typescript
// React 앱을 실행하는 가장 처음 코드
// HTML의 <div id="root"></div>에 App 컴포넌트를 렌더링
```
**역할**: 
- 앱의 진입점
- React 앱을 실행

---

### 2️⃣ `src/App.tsx` - 메인 컴포넌트
```typescript
// 라우팅 설정 (페이지 이동)
// 인증 상태 관리 (로그인 여부 확인)
```
**역할**:
- 라우팅 설정 (어떤 URL에서 어떤 페이지를 보여줄지)
- 인증 상태 감지 (사용자가 로그인했는지 확인)
- 로딩 화면 표시

**라우팅 예시**:
| URL | 페이지 |
|-----|--------|
| `/` | HomePage (메인) |
| `/login` | LoginPage |
| `/signup` | SignUpPage |

---

### 3️⃣ `src/lib/firebase.ts` - Firebase 설정
```typescript
// Firebase를 초기화하고 인스턴스를 export
// 각 파일에서 이를 import해서 사용
```
**역할**:
- Firebase 앱 초기화
- Authentication, Firestore 인스턴스 생성
- 다른 파일에서 import해서 사용

**쉽게 말하면**: 
- 웹사이트와 Firebase(구글 서비스)를 연결하는 교각 역할

---

### 4️⃣ `src/lib/auth.ts` - 인증 함수들
```typescript
// 회원가입, 로그인, 로그아웃 등의 함수
// Firebase Auth API를 더 쉽게 사용할 수 있도록 래핑
```
**주요 함수들**:
- `signUp()` - 회원가입
- `login()` - 로그인
- `logout()` - 로그아웃
- `subscribeToAuthState()` - 인증 상태 변화 감지

---

### 5️⃣ `src/layout/MainLayout.tsx` - 레이아웃
```typescript
// 모든 페이지에서 공통으로 사용하는 구조
// Header + Main Content + Footer
```
**역할**:
- 상단 헤더 표시
- 페이지 내용 표시 (중앙)
- 하단 푸터 표시

**구조**:
```
┌─────────────────────────┐
│      Header (네비)      │
├─────────────────────────┤
│   Main (페이지 내용)    │  ← Outlet (여기에 페이지가 들어옴)
│                         │
├─────────────────────────┤
│      Footer (하단)      │
└─────────────────────────┘
```

---

### 6️⃣ `src/pages/` - 페이지들

#### HomePage.tsx
- 메인 페이지
- 블로그 글 목록 표시
- 로그인한 사용자만 접근 가능

#### LoginPage.tsx
- 로그인 폼
- 이메일 + 비밀번호 입력
- 로그인 버튼

#### SignUpPage.tsx
- 회원가입 폼
- 이메일, 비밀번호 입력
- 가입 버튼

---

### 7️⃣ `src/components/` - 재사용 컴포넌트

#### Header.tsx
- 상단 네비게이션
- 사용자 정보 표시
- 로그아웃 버튼

#### FirebaseStatus.tsx
- Firebase 연결 상태 표시
- 디버깅용

#### StatusItem.tsx
- 상태 아이템 표시
- 작은 카드 형태

---

### 8️⃣ `src/types/index.ts` - 데이터 타입 정의
```typescript
// TypeScript 타입들을 정의
// 예: User 타입 (사용자 데이터 구조)

interface User {
  uid: string;        // 사용자 고유 ID
  email: string;      // 이메일
  displayName?: string;  // 닉네임 (선택사항)
}
```

---

## 🔄 데이터 흐름 (로그인 예시)

```
1. 사용자가 LoginPage에서 이메일/비밀번호 입력
   ↓
2. "로그인" 버튼 클릭
   ↓
3. auth.ts의 login() 함수 호출
   ↓
4. Firebase에 인증 요청 전송
   ↓
5. Firebase에서 응답 (성공/실패)
   ↓
6. App.tsx에서 subscribeToAuthState() 감지
   ↓
7. user 상태 업데이트
   ↓
8. Header, Layout 등이 다시 렌더링
   ↓
9. HomePage로 자동 이동 (또는 오류 메시지 표시)
```

---

## 💡 초보자를 위한 팁

### 1. 컴포넌트란?
- 화면의 재사용 가능한 조각
- 예: 버튼, 입력창, 카드 등

### 2. 상태(State)란?
- 변할 수 있는 데이터
- 예: 사용자가 입력한 이메일, 로그인 여부

### 3. Props란?
- 부모에서 자식 컴포넌트로 전달하는 데이터
- 예: `<Header user={user} />`에서 user는 props

### 4. useEffect란?
- 컴포넌트가 화면에 나타날 때 어떤 작업을 할지 정의
- 예: 인증 상태 감지, 데이터 로드 등

### 5. TypeScript란?
- JavaScript에 "타입"을 추가해서 더 안전하게
- 예: `user: User` (user는 반드시 User 타입이어야 함)

---

## 🚀 실행하는 방법

```bash
# 1. 라이브러리 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 http://localhost:5173 열기

# 4. 코드 검사
npm run lint

# 5. 배포용 빌드
npm run build
```

---

## 🔐 환경 변수

`.env.local` 파일을 만들어야 합니다:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📝 다음 단계

1. **Header 컴포넌트 분석** - 네비게이션 구조 이해
2. **로그인 로직 추적** - auth.ts와 LoginPage 연결
3. **HomePage 구현** - 블로그 글 표시 기능
4. **스타일 커스터마이징** - Tailwind CSS 학습
5. **Firestore 연동** - 데이터베이스 저장/조회

---

## ❓ 자주 묻는 질문

**Q: React와 Vue의 차이는?**
A: React는 Facebook에서 만들었고, Vue는 더 간단합니다. 이 프로젝트는 React를 사용합니다.

**Q: Firebase는 뭐예요?**
A: Google의 클라우드 서비스. 로그인 관리, 데이터 저장 등을 쉽게 할 수 있습니다.

**Q: TypeScript가 복잡한데요?**
A: 처음엔 어렵지만, 코드 오류를 미리 찾을 수 있어 배울 가치가 있습니다!

---

**더 궁금한 점이 있으면 물어보세요!** 💬
