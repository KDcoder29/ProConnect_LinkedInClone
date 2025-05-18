import { BASE_URL } from '@/config';
import { AcceptConnection, getMyConnectionsRequests } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userlayout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getMyConnectionsRequests({ token: localStorage.getItem('token') }));
  }, []);

  const handleAccept = (userId) => {
    dispatch(AcceptConnection({
      connectionId: userId,
      token: localStorage.getItem("token"),
      action: "accept"
    }));

    setTimeout(() => {
      dispatch(getMyConnectionsRequests({ token: localStorage.getItem('token') }));
    }, 1000);
  };

  const handleReject = (userId) => {
    dispatch(AcceptConnection({
      connectionId: userId,
      token: localStorage.getItem("token"),
      action: "reject"
    }));

    setTimeout(() => {
      dispatch(getMyConnectionsRequests({ token: localStorage.getItem('token') }));
    }, 1000);
  };

  const pendingRequests = authState.connectionRequest.filter((c) => c.status_accepted === null);
  const myNetwork = authState.connectionRequest.filter((c) => c.status_accepted === true);

  const filteredNetwork = myNetwork.filter(user =>
    user.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.pageContainer}>
          <div>
            <h2 className={styles.sectionTitle}>Pending Connection Requests</h2>
            {pendingRequests.length === 0 ? (
              <p>No connection requests at the moment.</p>
            ) : (
              pendingRequests.map((user, index) => (
                <div className={styles.userCard} key={index}>
                  <div
                    onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                    style={{ display: "flex", alignItems: "center", flex: 1 }}
                  >
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile" />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                  <button
                    className={styles.connectedButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(user._id);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(user._id);
                    }}
                  >
                    Reject
                  </button>
                </div>
              ))
            )}
          </div>

          <div>
            <div className={styles.searchHeader}>
              <h2 className={styles.sectionTitle}>My Network</h2>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by name or username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredNetwork.length === 0 ? (
              <p>No matching connections found.</p>
            ) : (
              filteredNetwork.map((user, index) => (
                <div className={styles.userCard} key={index}>
                  <div
                    onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                    style={{ display: "flex", alignItems: "center", flex: 1 }}
                  >
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile" />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
