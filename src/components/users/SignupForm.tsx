import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("회원가입 완료 되었습니다.");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
      const valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!value.match(valid)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }
    if (name === "password") {
      setPassword(value);
      if (value.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== passwordConfirmation) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다");
      } else {
        setError("");
      }
    }
    if (name === "password_confirmation") {
      setPasswordConfirmation(value);
      if (value.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다");
      } else {
        setError("");
      }
    }
  };
  const onClickSocialLogin = async (e: any) => {
    const {
      target: { name },
    } = e;
    let provider;
    const auth = getAuth(app);
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }
    if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(
      auth,
      provider as GithubAuthProvider | GoogleAuthProvider
    )
      .then((result) => {
        toast.success("로그인 되었습니다.");
      })
      .catch((error: any) => {
        const errorMsg = error?.message;
        toast.error(errorMsg);
      });
  };
  return (
    <>
      <form className="form form--lg" onSubmit={onSubmit}>
        <div className="form__title">회원가입</div>
        <div className="form__block">
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            required
            onChange={onChange}
          />
        </div>
        <div className="form__block">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            required
            onChange={onChange}
          />
        </div>
        <div className="form__block">
          <label htmlFor="password_confirmation">비밀번호 확인</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            value={passwordConfirmation}
            required
            onChange={onChange}
          />
        </div>
        {error && error.length > 0 && (
          <div className="form__block">
            <div className="form__error">{error}</div>
          </div>
        )}
        <div className="form__block">
          계정이 이미 있다면?
          <Link to="/users/login" className="form__link">
            로그인 하기
          </Link>
        </div>
        <div className="form__block--lg">
          <button
            type="submit"
            className="form__btn--submit"
            disabled={error.length > 0}
          >
            회원가입
          </button>
        </div>
        <div className="form__block">
          <button
            type="button"
            name="google"
            className="form__btn--google"
            onClick={onClickSocialLogin}
          >
            Google 회원가입
          </button>
        </div>
        <div className="form__block">
          <button
            type="button"
            name="github"
            className="form__btn--github"
            onClick={onClickSocialLogin}
          >
            GitHub 회원가입
          </button>
        </div>
      </form>
    </>
  );
}
