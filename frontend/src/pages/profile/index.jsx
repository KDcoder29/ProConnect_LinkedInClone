import UserLayout from '@/layout/userlayout'
import React, { useEffect, useState } from 'react'
import Dashboard from '../dashboard'
import DashboardLayout from '@/layout/dashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/action/authAction'
import styles from "./index.module.css"
import clientServer, { BASE_URL } from '@/config'
import { useSearchParams } from 'next/navigation'
import { getAllPosts } from '@/config/redux/action/postAction'

export default function ProfilePage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);
  
    const [userProfile, setUserProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companyName , setCompanyName] = useState("");
    const [inputData, setInputData] = useState({company : '', position : '', years : ''});

    const handleWorkInputChange = (e) =>{
        const {name,value} = e.target;
        setInputData({...inputData, [name]:value});
    }
  
    useEffect(() => {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      dispatch(getAllPosts());
    }, []);
  
    useEffect(() => {
      if (authState.user && postReducer.posts.length) {
        setUserProfile(authState.user);
  
        const filteredPosts = postReducer.posts.filter(
          (post) => post.userId.username === authState.user?.userId?.username
        );
  
        setUserPosts(filteredPosts);
      }
    }, [authState.user, postReducer.posts]);
  
    const profilePicture = userProfile?.userId?.profilePicture
      ? `${BASE_URL}/${userProfile.userId.profilePicture}`
      : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';
  
    if (!userProfile) return <p>Loading...</p>;

    const updateProfilePicture = async (file) =>{
        const formData = new FormData();
        formData.append("profile_picture",file);
        formData.append("token",localStorage.getItem("token"));

        console.log("Before update profile picture : " );

        const response = await clientServer.post("/update_profile_picture",formData,{
            
            headers : {
                'Content-Type' : 'multipart/form-data'
            },
        })
        dispatch(getAboutUser({token : localStorage.getItem("token")}))
    }

    const updateProfileData = async ()=>{
        const request = await clientServer.post("/user_update",{
            token : localStorage.getItem("token"),
            name : userProfile.userId.name, 
        })
        const response = await clientServer.post("/update_profile_data",{
            token : localStorage.getItem("token"),
            bio : userProfile.bio,
            currentPost : userProfile.currentPost,
            pastWork : userProfile.pastWork,
            education  : userProfile.education 
        });
        dispatch(getAboutUser({token : localStorage.getItem("token")}))
    }
      
  return (
    <UserLayout>
        <DashboardLayout>
            {authState.user && userProfile && 
        <div className={styles.container}>

<div className={styles.backDropContainer}>
  <label   htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
    Edit 
    <svg
        className={styles.editIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
        />
        </svg>
    </label>
        <input hidden onChange={(e) => {
    updateProfilePicture(e.target.files[0])
  }} type="file" id='profilePictureUpload' className={styles.hiddenInput}/>
    <img className={styles.profilePicture}  src={profilePicture} alt="" /> 
</div>

<div className={styles.profileContainer_details}>
  <div style={{display: "flex",gap : "0.7rem"}}>

      <div style={{flex : "0.8"}}>
      
        <div style={{display: "flex", width : "fit-content", alignItems : "center",gap: "1.2rem"}}>
            <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                setUserProfile({...userProfile,userId : {...userProfile.userId, name : e.target.value}})
            }} />
          <p style={{color : "grey"}}>@{userProfile.userId?.username}</p>
        </div>

          

      <textarea value={userProfile.bio} onChange={(e)=>{
        setUserProfile({...userProfile,bio:e.target.value})
      }}
      rows={Math.max(3,Math.ceil(userProfile.bio.length/80))}
      style={{width : "100%",border: "1px solid black"}}>

      </textarea>
      </div>

      <div style={{flex : "0.2"}}>
          <h3>Recent Activity</h3>
          {userPosts.map((post)=>{   // UserPosts == the posts that we have filtered above in useEffect
              return(
                <div key = {post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card_profileContainer}>
                    {post.media!== "" ? <img src={`${BASE_URL}/${post.media}`} alt='no image' ></img>
                    : <div style={{width: "3.4rem",height: "3.4rem"}}></div>}
                    </div>
                    <p>{post.body}</p>
                  </div>
                </div>
              )
          })}
      </div>
  </div>
</div>
    
    <div className={styles.workHistory}>
      <h4>Work History</h4>
      <div className={styles.workHistoryContainer}>
        {
          userProfile.pastWork.map((work,index)=>{
            return (
              <div className={styles.workHistoryCard}>
                <p style={{fontWeight: "bold", display: "flex", alignItems : "center", gap : "0.8rem", }}>{work.company} - {work.position}</p>
                <p>{work.years}</p>
                
              </div>
            )
          })
        }

        <button className={styles.addWorkButton} onClick={()=>{
            setIsModalOpen(true)
        }}>
            Add Work
        </button>
      </div>

    </div>

    {userProfile!= authState.user && <div onClick={()=>{
        updateProfileData()
    }} className={styles.updateProfileButton}>Update Profile</div>}

</div>
}


{isModalOpen && (
  <div onClick={() => {setIsModalOpen(false)}} className={styles.overlay}>
    <div onClick={(e) => e.stopPropagation()} className={styles.modal}>
    <input onChange={handleWorkInputChange}name='company' className={styles.inputfield} type="text" placeholder='Enter Company' />
    <input onChange={handleWorkInputChange}name='position' className={styles.inputfield} type="text" placeholder='Enter Position' />
    <input onChange={handleWorkInputChange}name='years' className={styles.inputfield} type="number" placeholder='Years' />
    <div className={styles.updateProfileButton} onClick={()=>{
        setUserProfile({...userProfile, pastWork : [...userProfile.pastWork, inputData]})
        setIsModalOpen(false);
    }}>Add Work</div>
    </div>
  </div>)}
        </DashboardLayout>
    </UserLayout>
  )
}
