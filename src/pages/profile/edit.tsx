import PostHeader from "components/posts/PostHeader";
import AuthContext from "context/AuthContext";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import {
  uploadString,
  getDownloadURL,
  ref,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "firebaseApp";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useTranslation from "hooks/useTranslation";

const STORAGE_DOWNLOAD_URL = "https://firebasestorage.googleapis.com";

export default function ProfileEdit() {
  const [displayName, setDisplayName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const t = useTranslation();

  useEffect(() => {
    if (user?.photoURL) setImgUrl(user?.photoURL);
    if (user?.displayName) setDisplayName(user?.displayName);
  }, [user?.displayName, user?.photoURL]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "displayName") {
      setDisplayName(value);
    }
  };
  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImgUrl(result);
    };
  };

  const handleDeleteImg = () => {
    setImgUrl(null);
  };

  const onSubmit = async (e: any) => {
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImgUrl = null;
    e.preventDefault();
    try {
      // 기존이미지가 my-twitter 앱에서 업로드한 이미지 일때만 기존 이미지 삭제
      // 구글 계정일 경우 구글 프로필을 이미 가지고 있는데 이건 참조를 my-twitter 앱의 firebase storage에 없고 가져올 수 없다.
      if (user?.photoURL && user?.photoURL.includes(STORAGE_DOWNLOAD_URL)) {
        const imgRef = ref(storage, user?.photoURL);
        if (imgRef) {
          await deleteObject(imgRef).catch((error) => {
            console.log(error);
          });
        }
      }
      // 새 이미지 업로드
      if (imgUrl) {
        const data = await uploadString(storageRef, imgUrl, "data_url");
        newImgUrl = await getDownloadURL(data.ref);
      }
      // 프로필 업데이트
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImgUrl || "",
        })
          .then(() => {
            toast.success("프로필이 업데이트 되었습니다.");
            navigate("/profile");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="post">
        <PostHeader />
        <form className="post-form" onSubmit={onSubmit}>
          <div className="post-form__profile">
            <input
              type="text"
              name="displayName"
              className="post-form__input"
              placeholder="이름"
              onChange={onChange}
              value={displayName}
            />
            <div className="post-form__submit-area">
              <div className="post-form__image-area">
                <label htmlFor="file-input" className="post-form__title">
                  <FiImage className="post-form__file-icon" />
                </label>
              </div>
              <input
                type="file"
                id="file-input"
                name="file-input"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {imgUrl && (
                <div className="post-form__attachment">
                  <img src={imgUrl} alt="attachment" width={100} height={100} />
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
                value="프로필 수정"
                className="post-form__submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
