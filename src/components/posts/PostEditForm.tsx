import { FiImage } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";
export default function PostEditForm() {
  const [content, setContent] = useState<string>("");
  const [post, setPost] = useState<PostProps | null>(null);
  const navigate = useNavigate();
  const handleFileUpload = () => {};

  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...docSnap.data(), id: docSnap.id } as PostProps);
      setContent(docSnap.data()?.content);
    }
  }, [params.id]); // params.id 가 있을때만 useCallback 실행됨

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);
  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          content: content,
        });
        navigate(`/posts/${post.id}`);
        toast.success("게시글을 수정하였습니다.");
      }
    } catch (e: any) {}
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "content") {
      setContent(value);
    }
  };
  return (
    <>
      {/** Post Form */}
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          className="post-form__textarea"
          required
          name="content"
          id="content"
          placeholder="What is happening"
          onChange={onChange}
          value={content}
        />
        <div className="post-form__submit-area">
          <label htmlFor="file-input" className="post-form__title">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input type="submit" value="수정" className="post-form__submit-btn" />
        </div>
      </form>
    </>
  );
}
