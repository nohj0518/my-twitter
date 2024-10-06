import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "pages/home";
import PostListPage from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostNew from "pages/posts/new";
import PostEdit from "pages/posts/edit";
export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/posts" element={<PostListPage />}></Route>
      <Route path="/posts/:id" element={<PostDetail />}></Route>
      <Route path="/posts/new" element={<PostNew />}></Route>
      <Route path="/posts/edit/:id" element={<PostEdit />}></Route>
      <Route path="/profile" element={<>profile page</>}></Route>
      <Route path="/profile/edit" element={<>profile edit page</>}></Route>
      <Route path="/notifications" element={<>notification page</>}></Route>
      <Route path="/search" element={<>search page</>}></Route>
      <Route path="/users/login" element={<>login page</>}></Route>
      <Route path="/users/signup" element={<>signup page</>}></Route>
      <Route path="*" element={<Navigate replace to="/" />}></Route>
    </Routes>
  );
}
