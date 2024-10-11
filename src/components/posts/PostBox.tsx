import { FaUserCircle } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { PostProps } from "pages/home";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까 ?");
    if (confirm) {
      await deleteDoc(doc(db, "posts", post.id));
      navigate("/");
      toast.success("게시글을 삭제 했습니다.");
    }
  };
  return (
    <>
      <div className="post__box" key={post?.id}>
        <Link to={`/posts/${post.id}`}>
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
              <div className="post__email">{post.email}</div>
              <div className="post__createdAt">{post.createdAt}</div>
            </div>
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
          </div>
        </Link>
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
                  Delete
                </button>

                <button type="button" className="post__edit">
                  <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
                </button>
              </>
            ) : (
              <></>
            )
          }
          <>
            <button type="button" className="post__likes">
              <AiFillHeart />
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
