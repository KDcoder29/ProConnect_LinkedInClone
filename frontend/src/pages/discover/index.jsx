import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userlayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function DiscoverPage() {

  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch(); 
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [])

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.pageContainer}>
          <h1 className={styles.pageTitle}>Discover</h1>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && authState.all_users.map((user) => (
              <div
                key={user._id}
                className={styles.userCard}
                onClick={() => router.push(`/view_profile/${user.userId.username}`)}
              >
                <img
                  className={styles.userCard_image}
                  src={`${BASE_URL}/${user.userId.profilePicture}`}
                  alt="Profile"
                />
                <div className={styles.userInfo}>
                  <h1>{user.userId.name}</h1>
                  <p>{user.userId.email}</p>
                </div>
                <div className={styles.overlay}>View Profile</div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
