import { FiImage } from "react-icons/fi";
import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import useTranslation from "hooks/useTranslation";
export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>("");
  const [imgFile, setImgFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const t = useTranslation();
  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImgFile(result);
    };
  };

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      // 이미지를 먼저 storage 로 업로드 하기
      let imgUrl = "";
      if (imgFile) {
        const data = await uploadString(storageRef, imgFile, "data_url");
        imgUrl = await getDownloadURL(data?.ref);
      }

      // 업로드된 이미지의 download url 을 업데이트 해주기
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imgUrl: imgUrl,
      });
      setTags([]);
      setHashTag("");
      setContent("");
      setImgFile(null);
      toast.success("게시글을 생성하였습니다.");
      setIsSubmitting(false);
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
  const handleDeleteImg = () => {
    setImgFile(null);
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
          placeholder={t("POST_PLACEHOLDER")}
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
            placeholder={t("POST_HASHTAG")}
            onChange={onChangeHashTag}
            onKeyUp={handleKeyUp}
            value={hashTag}
          />
        </div>
        <div className="post-form__submit-area">
          <div className="post-form__image-area">
            <label htmlFor="file-input" className="post-form__title">
              <FiImage className="post-form__file-icon" />
            </label>
            <input
              type="file"
              id="file-input"
              name="file-input"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {imgFile && (
            <div className="post-form__attachment">
              <img src={imgFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImg}
              >
                {t("BUTTON_DELETE")}
              </button>
            </div>
          )}

          <input
            type="submit"
            value="Tweet"
            className="post-form__submit-btn"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </>
  );
}
