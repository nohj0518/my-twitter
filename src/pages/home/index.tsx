import { useCallback, useContext, useEffect, useState } from "react";
import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: [];
  hashTags?: string[];
  imgUrl?: string;
}

interface UserProps {
  id: string;
}

type tabType = "all" | "following";

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const [activeTab, setActiveTab] = useState<tabType>("all");
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  // 실시간 동기화로 user 의 팔로잉 id 배열을 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user?.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds((prev: string[]) =>
              prev ? [...prev, user.id] : []
            )
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      let followingQuery = query(postsRef, where("uid", "in", followingIds));

      onSnapshot(postsQuery, (snapShot) => {
        let dataObject = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObject as PostProps[]);
      });
      onSnapshot(followingQuery, (snapShot) => {
        let dataObject = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingPosts(dataObject as PostProps[]);
      });
    }
  }, [followingIds, user]);

  useEffect(() => {
    if (user?.uid) getFollowingIds();
  }, [getFollowingIds, user?.uid]);
  return (
    <>
      <div className="home">
        <div className="home__top">
          <div className="home__title">{t("MENU_HOME")}</div>
          <div className="home__tabs">
            <div
              className={`home__tab ${
                activeTab === "all" && "home__tab--active"
              } `}
              onClick={() => setActiveTab("all")}
            >
              {t("TAB_ALL")}
            </div>
            <div
              className={`home__tab ${
                activeTab === "following" && "home__tab--active"
              } `}
              onClick={() => setActiveTab("following")}
            >
              {t("TAB_FOLLOWING")}
            </div>
          </div>
        </div>
        <PostForm />
        {/** Tweet posts */}
        <div className="post">
          {activeTab === "all" &&
            (posts.length > 0 ? (
              posts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">{t("NO_POSTS")}</div>
              </div>
            ))}

          {activeTab === "following" &&
            (followingPosts.length > 0 ? (
              followingPosts?.map((post) => (
                <PostBox post={post} key={post.id} />
              ))
            ) : (
              <div className="post__no-posts">
                <div className="post__text">{t("NO_POSTS")}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
