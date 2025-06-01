import Post from "../models/posts.model.js"
import User from "../models/user.model.js"
import Comment from "../models/comments.model.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";


export const activeCheck = async (req,res) =>{
    return res.status(200).json({message : "RUNNING"})
}

export const createPost = async (req,res)=>{
    const {token} = req.body;
    try{
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message : "User Not Found"});

        const post = new Post({
            userId : user._id,
            body : req.body.body,
            media : req.file != undefined ? req.file.filename : "",
            fileType : req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })
        await post.save();
        return res.status(200).json({message : "Post Created"})
    }catch(error){
        return res.status(500).json({message : error.message});
    }
}

export const getAllPosts = async(req, res) => {
    try {
        console.log("Fetching posts...");
        const posts = await Post.find()
            .populate('userId', 'name username email profilePicture')
            .populate('likedBy', '_id'); // optional: populate user IDs who liked

        return res.json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const deletePost = async (req,res) =>{
    const {token , post_id} = req.body;
    try{
        const user = await User.findOne({token });
        if(!user) return res.status(404).json({message  : "User Not Found"});

        const post = await Post.findOne({_id : post_id , userId : user._id})
        if(!post) return res.status(404).json({message : "Post Not Found"});

        if(post.userId.toString()!== user._id.toString()){
            return res.status(401).json({message : "Unauthorized"})
        }

        await post.deleteOne({_id: post_id})
        // post.active = false;
        // await post.save();
        return res.json({message : "Post Deleted"});

    }catch(error){
        return res.status(500).json({message : error.message });
    }
}

export const commentPost = async (req,res) =>{
    const {token, post_id , commentBody} = req.body;
    try{
        const user = await User.findOne({token : token});
        if(!user) return res.status(404).json({message : "User not found"})

        const post = await Post.findOne({
            _id : post_id
        })
        if(!post) return res.status(404).json({message : "Post not found"})

        const comment = new Comment ({
            userId : user._id,
            postId : post_id,
            body : commentBody
        })
        await comment.save() 

        return res.status(200).json({message : "Comment Added"});
    }catch(error){
        console.error("Error saving comment:", error); // Add detailed log
        return res.status(500).json({ message: error.message });
    }
}

export const get_comments_by_post = async (req,res)=>{
    const {postId} = req.query;
    try{
        const post = await Post.findOne({  _id : postId});
        if(!post) return res.status(404).json({message : "Post not found"})

            const comments = await Comment.find({ postId: postId }).populate("userId","username name profilePicture");

            return res.status(200).json(comments.reverse()); 
    }catch(error){
        return res.status(500).json({message : error.message})
    }
}

export const delete_comment_of_user = async(req,res) =>{
    const{token, comment_id} = req.body;
    try{
        const user = await User.findOne({token : token}).select("_id");
        if(!user) return res.status(404).json({message : "User not found"})

        const comment = await Comment.findOne({_id : comment_id})
        if(!comment) return res.status(404).json({message : "Comment not found"})

        await Comment.deleteOne({_id : comment_id})
        return res.json({message : "Comment Deleted"})

    }catch(error){
        return res.status(500).json({message : error.message})
    }
}



export const increment_likes = async (req, res) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Find user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "User not found or token invalid" });
    }

    const userId = user._id;

    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ message: "post_id is required" });
    }

    // Find the post
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likedBy.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      // User already liked: decrement likes and remove userId from likedBy
      post.likes = Math.max(post.likes - 1, 0); // prevent negative likes
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());

      await post.save();
      return res.status(200).json({ message: "Like removed", likes: post.likes });
    } else {
      // User not liked yet: increment likes and add userId
      post.likes += 1;
      post.likedBy.push(userId);

      await post.save();
      return res.status(200).json({ message: "Post liked successfully", likes: post.likes });
    }

  } catch (error) {
    console.error("Error incrementing likes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};





// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Make sure it contains the `id`
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
// export const authenticate = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // { _id: userId, name: ..., email: ... }
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };
