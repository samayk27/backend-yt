import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

 const registerUser = asyncHandler( async (req, res) => {
    const {username, email, password, fullName} = req.body;
    if([username, email, password, fullName].some( field => field?.trim() === "")){  
        throw new ApiError(400, "Please provide all the required fields")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    console.log(req.files)
    const avatarLocalPath =req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)
    
   
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }
   const user = await User.create({
        fullName,
        username : username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
   const createdUser = await User.findById(user._id).select("-password -refreshToken")
   if(!createdUser){
       throw new ApiError(500, "User not created")
   }
   return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))
})
 export {
     registerUser,
 }