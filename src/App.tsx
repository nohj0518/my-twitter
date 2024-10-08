import { useState, useEffect } from "react";

import Router from "components/Router";
import { Layout } from "components/Layout";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { ToastContainer } from "react-toastify";

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );
  /**
   * auth 에 대한 설명
   * firebaseApp 에서 firebaseApp 을 초기화 해주었는데
   * 로그인 한 사람이든 아닌 사람이든 그 사람의 정보를 조회해서
   * getAuth 가 firebase 객체를 반환한다.
   * 그리고 이 객체에 currentUser 에 로그인했으면
   * 로그인 한 유저의 정보를 객체로 담고 있고
   * 로그인 안 한 유저면 null 이 담긴다.
   */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);
  return (
    <>
      <Layout>
        <ToastContainer />
        {init ? <Router isAuthenticated={isAuthenticated} /> : "loading"}
      </Layout>
    </>
  );
}

export default App;
