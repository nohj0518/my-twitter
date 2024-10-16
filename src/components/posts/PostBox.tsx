import { FaUserCircle } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { PostProps } from "pages/home";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { storage } from "firebaseApp";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";
import FollowingBox from "components/following/FollowingBox";
import useTranslation from "hooks/useTranslation";
interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imgRef = ref(storage, post?.imgUrl);
  const t = useTranslation();
  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까 ?");
    if (confirm) {
      if (post.imgUrl) {
        deleteObject(imgRef).catch((error) => {
          console.log(error);
        });
      }

      await deleteDoc(doc(db, "posts", post.id));
      navigate("/");
      toast.success("게시글을 삭제 했습니다.");
    }
  };
  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post.likes?.includes(user.uid)) {
      // 좋아요 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post.likeCount ? post.likeCount - 1 : 0,
      });
    } else {
      // 좋아요 적용
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post.likeCount ? post.likeCount + 1 : 1,
      });
    }
  };
  return (
    <>
      <div className="post__box" key={post?.id}>
        <div className="post__box-profile">
          <div className="post__flex">
            {post.profileUrl ? (
              <img
                src={post.profileUrl}
                alt="profile"
                className="post__box-profile-img"
              />
            ) : (
              <FaUserCircle className="post__box-profile-icon" />
            )}
            <div className="post__flex--between">
              <div className="post__flex">
                <div className="post__email">{post.email}</div>
                <div className="post__createdAt">{post.createdAt}</div>
              </div>
              <FollowingBox post={post} />
            </div>
          </div>
          <Link to={`/posts/${post.id}`}>
            <div className="post__box-content">{post?.content}</div>

            {post?.imgUrl && (
              <div className="post__image-div">
                <img
                  src={post?.imgUrl}
                  alt="post img"
                  className="post__image"
                  width={100}
                  height={100}
                />
              </div>
            )}

            <div className="post__box-hashtags-outputs">
              {post?.hashTags?.map((tag, idx) => (
                <span className="post-form__hashtags-tag" key={idx}>
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        </div>
        <div className="post__box-footer">
          {
            /** post.uid === user.id */
            post.uid === user?.uid ? (
              <>
                <button
                  type="button"
                  className="post__delete"
                  onClick={handleDelete}
                >
                  {t("BUTTON_DELETE")}
                </button>

                <button type="button" className="post__edit">
                  <Link to={`/posts/edit/${post?.id}`}>{t("BUTTON_EDIT")}</Link>
                </button>
              </>
            ) : (
              <></>
            )
          }
          <>
            <button type="button" className="post__likes" onClick={toggleLike}>
              {user &&
                (post?.likes?.includes(user?.uid) ? (
                  <AiFillHeart />
                ) : (
                  <AiOutlineHeart />
                ))}
              {post?.likeCount || 0}
            </button>

            <button type="button" className="post__edit">
              <FaRegComment />
              {post?.comments?.length || 0}
            </button>
          </>
        </div>
      </div>
    </>
  );
}
