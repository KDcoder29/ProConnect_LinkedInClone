import React from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          className={styles.brand}
          onClick={() => router.push('/dashboard')}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched ? (
            <div className={styles.authOptions}>
              <p
                className={styles.navItem}
                onClick={() => router.push('/profile')}
              >
                Profile
              </p>
              <p
                className={styles.navItem}
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
                  dispatch(reset());
                }}
              >
                Logout
              </p>
            </div>
          ) : (
            <div
              onClick={() => router.push('/login')}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
