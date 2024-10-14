import { useCallback, useState } from "react";
import { PostProps } from "pages/home";
import PostBox from "components/posts/PostBox";
import Loader from "components/loader/Loader";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import PostHeader from "components/posts/PostHeader";
import CommentForm from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";

export default function PostDetail() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      onSnapshot(docRef, (doc) => {
        setPost({ ...doc?.data(), id: doc?.id } as PostProps);
      });
    }
  }, [params.id]); // params.id 가 있을때만 useCallback 실행됨
  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);
  return (
    <>
      <div className="post">
        <PostHeader />
        {post ? (
          <>
            <PostBox post={post} />
            <CommentForm post={post} />
            {post?.comments
              ?.slice(0)
              ?.reverse()
              ?.map((data: CommentProps, index: number) => (
                <CommentBox data={data} key={index} post={post} />
              ))}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
