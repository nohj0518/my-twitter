import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";
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
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "test@test.com",
    content: "mock data1",
    createdAt: "2024-10-06",
    uid: "123123",
  },
  {
    id: "2",
    email: "test@test.com",
    content: "mock data2",
    createdAt: "2024-10-06",
    uid: "123123",
  },
  {
    id: "3",
    email: "test@test.com",
    content: "mock data3",
    createdAt: "2024-10-06",
    uid: "123123",
  },
];

export default function HomePage() {
  return (
    <>
      <div className="home">
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">for you</div>
          <div className="home__tab">follow</div>
        </div>
        <PostForm />
        {/** Tweet posts */}
        <div className="post">
          {posts?.map((post) => (
            <PostBox post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
}
