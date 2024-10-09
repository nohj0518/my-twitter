import { FiImage } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";
export default function PostEditForm() {
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>("");
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
      setTags(docSnap.data()?.hashTags);
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
          hashTags: tags,
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
  const onChangeHashTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "hashtag") {
      setHashTag(value.trim());
    }
  };
  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      if (tags?.includes(e.target.value?.trim())) {
        toast.error("같은 태그가 이미 있습니다.");
      } else {
        setTags((prev) => (prev.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };
  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
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
        <div className="post-form__hashtags">
          <span className="post-form__hashtags-outputs">
            {tags?.map((tag, idx) => (
              <span
                className="post-form__hashtags-tag"
                key={idx}
                onClick={() => removeTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </span>

          <input
            className="post-form__input"
            name="hashtag"
            id="hashtag"
            placeholder="해시태그+스페이스 입력"
            onChange={onChangeHashTag}
            onKeyUp={handleKeyUp}
            value={hashTag}
          />
        </div>
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
