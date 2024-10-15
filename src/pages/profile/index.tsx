import { languageState } from "atom";
import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const PROFILE_DEFAULT_URL = "/logo512.png";
type TabType = "my" | "like";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useRecoilState(languageState);
  const t = useTranslation();
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const myPostsQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const likePostsQuery = query(
        postsRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(myPostsQuery, (snapShot) => {
        let dataObject = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObject as PostProps[]);
      });
      onSnapshot(likePostsQuery, (snapShot) => {
        let dataObject = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObject as PostProps[]);
      });
    }
  }, [user]);

  const onClickLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };
  return (
    <>
      <div className="home">
        <div className="home__top">
          <div className="home__title">Profile</div>
          <div className="profile">
            <img
              src={user?.photoURL || PROFILE_DEFAULT_URL}
              alt="profile"
              className="profile__image"
              width={100}
              height={100}
            />
            {/** 수정/변환 */}
            <div className="profile__flex">
              <button
                type="button"
                className="profile__btn"
                onClick={() => navigate("/profile/edit")}
              >
                프로필 수정
              </button>
              <button
                type="button"
                className="profile__btn--language"
                onClick={onClickLanguage}
              >
                {language === "ko" ? "한국어" : "English"}
              </button>
            </div>

            <div className="profile__text">
              <div className="profile__name">
                {user?.displayName || "사용자님"}
              </div>
              <div className="profile__email">{user?.email}</div>
            </div>
          </div>
          <div className="home__tabs">
            <div
              className={`home__tab ${
                activeTab === "my" && "home__tab--active"
              } `}
              onClick={() => setActiveTab("my")}
            >
              For you
            </div>
            <div
              className={`home__tab ${
                activeTab === "like" && "home__tab--active"
              } `}
              onClick={() => setActiveTab("like")}
            >
              Likes
            </div>
          </div>
        </div>
        {activeTab === "my" && (
          <div className="post">
            {myPosts.length > 0 ? (
              myPosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">{t("NO_POSTS")}</div>
              </div>
            )}
          </div>
        )}
        {activeTab === "like" && (
          <div className="post">
            {likePosts.length > 0 ? (
              likePosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">{t("NO_POSTS")}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
