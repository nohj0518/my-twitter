import { useState } from "react";
import Router from "components/Router";
import { Layout } from "components/Layout";

import { getAuth } from "firebase/auth";
import { app } from "firebaseApp";

function App() {
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  /**
   * firebaseApp 에서 firebaseApp 을 초기화 해주었는데
   * 로그인 한 사람이든 아닌 사람이든 그 사람의 정보를 조회해서
   * getAuth 가 firebase 객체를 반환한다.
   * 그리고 이 객체에 currentUser 에 로그인했으면
   * 로그인 한 유저의 정보를 객체로 담고 있고
   * 로그인 안 한 유저면 null 이 담긴다.
   *
   */
  return (
    <>
      <Layout>
        <Router />
      </Layout>
    </>
  );
}

export default App;
