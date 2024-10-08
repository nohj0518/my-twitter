import { initializeApp, FirebaseApp, getApp } from "firebase/app";

export let app: FirebaseApp;
/**
 * 이렇게 export let app: FirebaseApp 해준 이유
 * 매번 initializeApp 해주어 매번 초기화가 이루어지도록 하지 않고
 * 처음에 들어왔을때 initialize 가 되어 있다면,
 * getApp 을 통해서 FirebaseApp을 가져와주고
 * //
 * 그게 아니라면(처음 로그인한 사람이라면)
 * 그때만 initialize 해주고 싶기 때문이다.
 * blog 프로젝트에서도 단 한번도 로그인하지 않은 사람만 로그인 페이지를 가장 처음 보여주는데
 * 위와 같이 구현되어 있기 때문임
 */
//

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
};

try {
  app = getApp("app");
} catch (e) {
  app = initializeApp(firebaseConfig, "app");
}

const firebase = initializeApp(firebaseConfig);

export default firebase;
