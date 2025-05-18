import clientServer, { BASE_URL } from '@/config';
import DashboardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userlayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import {
  getConnectionsRequest,
  getMyConnectionsRequests,
  sendConnectionRequest,
} from '@/config/redux/action/authAction';

export default function ViewProfile({ userData }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionsRequests({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    getUsersPost();
  }, []);

  useEffect(() => {
    const posts = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(posts);
  }, [postReducer.posts, router.query.username]);

  // 🔍 Derive connection status from Redux store
  const currentUserConnection = authState.connections.find(
    (user) => user.connection_Id._id === userData.profile.userId._id
  );

  const pendingRequest = authState.connectionRequest.find(
    (user) => user.userId._id === userData.profile.userId._id
  );

  const isCurrentUserInConnection = !!(currentUserConnection || pendingRequest);
  const isConnectionNull = pendingRequest && pendingRequest.status_accepted === null;
  const isConnected = currentUserConnection && currentUserConnection.status_accepted === true;

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const profilePicture = userData?.profile?.userId?.profilePicture
    ? `${BASE_URL}/${userData.profile.userId.profilePicture}`
    : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740';

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={profilePicture} alt="" />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                  <h2>{userData.profile.userId.name}</h2>
                  <p style={{ color: "grey" }}>@{userData.profile.userId.username}</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {isCurrentUserInConnection ? (
                    <button className={isConnected ? styles.connectedButton : styles.pendingButton}>
                      {isConnected ? "Connected" : "Pending"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userData.profile.userId._id,
                          })
                        );
                      }}
                      className={styles.connectButton}
                    >
                      Connect
                    </button>
                  )}

                  <div
                    onClick={async () => {
                      const response = await clientServer.get(`/user/download_resume?id=${userData.profile.userId._id}`);
                      window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                </div>

                <p>{userData.profile.bio}</p>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media !== "" ? (
                          <img src={`${BASE_URL}/${post.media}`} alt="no image" />
                        ) : (
                          <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                        )}
                      </div>
                      <p>{truncateText(post.body, 7)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userData.profile.pastWork.map((work, index) => (
                <div className={styles.workHistoryCard} key={index}>
                  <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    {work.company} - {work.position}
                  </p>
                  <p>{work.years}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  let userData = null;
  try {
    const res = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        username: context.query.username,
      },
    });
    userData = res.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error.message);
  }
  return {
    props: {
      userData,
    },
  };
}
