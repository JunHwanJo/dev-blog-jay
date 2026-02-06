
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  limit,
  where,
  startAfter,
  onSnapshot ,
} from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";


import { db } from "./firebase";
import type { Post, PostInput, PostSummary, User, Category } from "../types";

/**
 * posts 컬렉션 참조
 */
const postsCollection = collection(db, "posts");

/* ------------------------------------------------------------------
 * 게시글 작성
 * POST-001
 * ------------------------------------------------------------------ */
export async function createPost(
  input: PostInput,
  user: User,
): Promise<string> {
  const now = Timestamp.now();

  const postData = {
    title: input.title,
    content: input.content,
    category: input.category,
    authorId: user.uid,
    authorEmail: user.email,
    authorDisplayName: user.displayName,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(postsCollection, postData);
  return docRef.id;
}

/* ------------------------------------------------------------------
 * 게시글 목록 조회 (단순 버전)
 * POST-002
 * ------------------------------------------------------------------ */
export async function getPosts(
  limitCount: number = 20,
): Promise<PostSummary[]> {
  const q = query(
    postsCollection,
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      category: data.category,
      authorEmail: data.authorEmail,
      authorDisplayName: data.authorDisplayName,
      createdAt: data.createdAt,
    };
  });
}

/* ------------------------------------------------------------------
 * 게시글 상세 조회
 * POST-003
 * ------------------------------------------------------------------ */
export async function getPost(postId: string): Promise<Post | null> {
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Post;
}

/* ------------------------------------------------------------------
 * 게시글 수정
 * POST-004
 * ------------------------------------------------------------------ */
export async function updatePost(
  postId: string,
  input: PostInput,
): Promise<void> {
  const docRef = doc(db, "posts", postId);

  await updateDoc(docRef, {
    title: input.title,
    content: input.content,
    category: input.category,
    updatedAt: Timestamp.now(),
  });
}

/* ------------------------------------------------------------------
 * 게시글 삭제
 * POST-005
 * ------------------------------------------------------------------ */
export async function deletePost(postId: string): Promise<void> {
  const docRef = doc(db, "posts", postId);
  await deleteDoc(docRef);
}

/* ------------------------------------------------------------------
 * 게시글 목록 조회 (필터 + 페이지네이션)
 * POST-002 + POST-006
 * ------------------------------------------------------------------ */
export interface GetPostsOptions {
  category?: Category | null;
  limitCount?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface GetPostsResult {
  posts: PostSummary[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export async function getPostsWithOptions(
  options: GetPostsOptions = {},
): Promise<GetPostsResult> {
  const { category = null, limitCount = 5, lastDoc = null } = options;

  const constraints = [];

  // 카테고리 필터
  if (category) {
    constraints.push(where("category", "==", category));
  }

  // 최신순 정렬
  constraints.push(orderBy("createdAt", "desc"));

  // 페이지네이션
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  // 다음 페이지 존재 여부 확인용 +1
  constraints.push(limit(limitCount + 1));

  const q = query(postsCollection, ...constraints);
  const snapshot = await getDocs(q);

  const hasMore = snapshot.docs.length > limitCount;
  const docs = hasMore
    ? snapshot.docs.slice(0, limitCount)
    : snapshot.docs;

  const posts: PostSummary[] = docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      category: data.category,
      authorEmail: data.authorEmail,
      authorDisplayName: data.authorDisplayName,
      createdAt: data.createdAt,
    };
  });

  return {
    posts,
    lastDoc: docs.length ? docs[docs.length - 1] : null,
    hasMore,
  };
}

/**
 * 게시글 목록 실시간 구독
 * 
 * 데이터가 변경되면 자동으로 callback이 호출됩니다.
 * 
 * @param callback - 데이터 변경 시 호출될 함수
 * @param options - 조회 옵션
 * @returns 구독 해제 함수
 */
export function subscribeToPostsRealtime(
  callback: (posts: PostSummary[]) => void,
  options: { category?: Category | null; limitCount?: number } = {}
): () => void {
  const { category = null, limitCount = 20 } = options;

  const constraints = [];

  if (category) {
    constraints.push(where('category', '==', category));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(limitCount));

  const q = query(postsCollection, ...constraints);

  // onSnapshot은 구독 해제 함수를 반환
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        category: data.category,
        authorEmail: data.authorEmail,
        authorDisplayName: data.authorDisplayName,
        createdAt: data.createdAt,
      };
    });

    callback(posts);
  });
}
