import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts", //Action type
    async(_,thunkAPI)=>{
        try{
            const response = await clientServer.get("/get_posts");
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error);
        }
    }
) 


export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData,thunkAPI)=>{
        const {file,body} = userData;
        try{
            const formData = new FormData();
            formData.append('token',localStorage.getItem('token'))
            formData.append('body',body)
            formData.append('media',file)

            const response = await clientServer.post("/post",formData,{
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            if(response.status == 200){
            return thunkAPI.fulfillWithValue("Post Uploaded");
        }else{
            return thunkAPI.rejectWithValue("Post not uploaded")
        }
        }catch(error){
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id,thunkAPI)=>{
        try{
            const response = await clientServer.post("/delete_posts",{
                
                    token : localStorage.getItem("token"),
                    post_id : post_id.post_id
                
            })
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const incrementLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await clientServer.post(
        "/increment_likes",
        {
          post_id: post.post_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Important!
          }
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postData, thunkAPI) => {
      try {
        const response = await clientServer.get("/get_comments", {
          params: {
            postId: postData.post_id,
          },
        });
        return thunkAPI.fulfillWithValue({
          comments: response.data,
          postId: postData.post_id,
        }); 
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const postComment  = createAsyncThunk(
    "post/postComment",
    async(commentData,thunkAPI) =>{
        try{
            const response = await clientServer.post("/comment",{
                token : localStorage.getItem('token'),
                post_id : commentData.post_id,
                commentBody : commentData.body
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error);
        }
    }
  ) 

  

