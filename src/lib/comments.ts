import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  // orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Comment, CommentInput, User } from "@/types";

const commentsCollection = collection(db, "comments");

/**
 * 댓글 생성
 */
export async function createComment(
  postId: string,
  input: CommentInput,
  user: User,
): Promise<string> {
  const now = Timestamp.now();

  const commentData = {
    postId,
    content: input.content,
    authorId: user.uid,
    authorEmail: user.email,
    authorDisplayName: user.displayName,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(commentsCollection, commentData);
  return docRef.id;
}

/**
 * 특정 게시글의 댓글 목록 조회 (오래된 순)
 * 정렬은 클라이언트에서 처리합니다.
 */
export async function getCommentsByPostId(
  postId: string,
): Promise<Comment[]> {
  const q = query(
    commentsCollection,
    where("postId", "==", postId),
  );

  const snapshot = await getDocs(q);

  const comments = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      postId: data.postId,
      content: data.content,
      authorId: data.authorId,
      authorEmail: data.authorEmail,
      authorDisplayName: data.authorDisplayName,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Comment;
  });

  // 클라이언트에서 생성 시간 순으로 정렬
  return comments.sort((a, b) => {
    const timeA = a.createdAt?.toMillis?.() ?? 0;
    const timeB = b.createdAt?.toMillis?.() ?? 0;
    return timeA - timeB;
  });
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  input: CommentInput,
): Promise<void> {
  const docRef = doc(db, "comments", commentId);
  await updateDoc(docRef, {
    content: input.content,
    updatedAt: Timestamp.now(),
  });
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string): Promise<void> {
  const docRef = doc(db, "comments", commentId);
  await deleteDoc(docRef);
}
