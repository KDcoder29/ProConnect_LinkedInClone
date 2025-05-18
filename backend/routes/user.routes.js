import { Router } from "express"
import { acceptConnectionRequest, commentPost, createProfile, deleteCommentOfUser, downloadProfile, getAllUserProfile, getCommentsByPost, getMyConnectionsRequests, getUserAndProfile, getUserProfileAndUserBasedOnUsername, incrementLikes, login, register, sendConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture, whatAreMyConnections } from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

export const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,'uploads/')
    },
    
        filename : (req,file,cb) =>{
            cb(null,file.originalname)
        }
})

const upload = multer({storage : storage})
router.route("/update_profile_picture").post(upload.single('profile_picture'),uploadProfilePicture)

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_user_profile").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/get_connection_requests").post(getMyConnectionsRequests);
router.route("/user/user_connection_requests").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/add_comment").post(commentPost);
router.route("/user/get_comments_by_post").get(getCommentsByPost);
router.route("/user/delete_comment").post(deleteCommentOfUser);
router.route("/user/like_post").post(incrementLikes);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername)
router.route("/user/create_profile").post(createProfile);
export default router;

