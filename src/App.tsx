import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "pages/home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/posts" element={<>posts list page</>}></Route>
        <Route path="/posts/:id" element={<>posts detail page</>}></Route>
        <Route path="/posts/new" element={<>posts new page</>}></Route>
        <Route path="/posts/edit/:id" element={<>post edit page</>}></Route>
        <Route path="/profile" element={<>profile page</>}></Route>
        <Route path="/profile/edit" element={<>profile edit page</>}></Route>
        <Route path="/notifications" element={<>notification page</>}></Route>
        <Route path="/search" element={<>search page</>}></Route>
        <Route path="/users/login" element={<>login page</>}></Route>
        <Route path="/users/signup" element={<>signup page</>}></Route>
        <Route path="*" element={<Navigate replace to="/" />}></Route>
      </Routes>
    </>
  );
}

export default App;
