import UserLayout from '@/layout/userlayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import dynamic from 'next/dynamic';

// Dynamically import icons (client-side only to avoid hydration issues)
const FaEye = dynamic(() => import('react-icons/fa').then(mod => mod.FaEye), { ssr: false });
const FaEyeSlash = dynamic(() => import('react-icons/fa').then(mod => mod.FaEyeSlash), { ssr: false });

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, []);

  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }));
    setUserLoginMethod(true);
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>{userLoginMethod ? 'Sign in' : 'Sign Up'}</p>
            <p style={{ color: authState.isError ? 'red' : 'green' }}>{authState.message.message}</p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input onChange={(e) => setUsername(e.target.value)} className={styles.inputfield} type="text" placeholder="Username" />
                  <input onChange={(e) => setName(e.target.value)} className={styles.inputfield} type="text" placeholder="Name" />
                </div>
              )}

              <input onChange={(e) => setEmail(e.target.value)} className={styles.inputfield} type="text" placeholder="Email" />

              {/* Password Field with Eye Toggle */}
              <div className={styles.passwordFieldWrapper}>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputfield}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                />
                <span className={styles.eyeIcon} onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div
                onClick={() => {
                  userLoginMethod ? handleLogin() : handleRegister();
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? 'Sign in' : 'Sign Up'}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            {userLoginMethod ? <p>Don't Have an Account?</p> : <p>Already Have an Account?</p>}
            <div
              onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }}
              style={{ color: 'black', textAlign: 'center' }}
              className={styles.buttonWithOutline}
            >
              <p>{userLoginMethod ? 'Sign Up' : 'Sign in'}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
