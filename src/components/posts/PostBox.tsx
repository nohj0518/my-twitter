import { FaUserCircle } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { PostProps } from "pages/home";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
  const handleDelete = () => {};
  const { user } = useContext(AuthContext);
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
