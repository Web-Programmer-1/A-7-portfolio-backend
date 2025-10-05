import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";

// User Register 

export const registerUser = catchAsync(async (req: Request, res:Response) => {

    const UserData = await authService.userCreate(req.body);

    res.status(201).send({
        success:true,
        message:"User Created Successfully",
        data:UserData
    })
  
  
});


// User Login 


export const loginUser = catchAsync(async(req: Request, res:Response) => {
  
    const user = await authService.userLogin(req.body, res);

    res.status(200).send({
        success:true,
        message:"User Login Successfully",
       user,
        
    })
    


});




export const totalUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, email, role } = req.query;

  const result = await authService.allUsers({
    page: page ? parseInt(page as string) : 1,
    limit: limit ? parseInt(limit as string) : 10,
    email: email as string | undefined,
    role: role as "USER" | "ADMIN" | undefined,
  });

  res.status(200).json({
    success: true,
    message: "All Users Retrieved Successfully!",
    ...result,
  });
});





export const getProfile = async (req: Request, res: Response) => {
  const user = (req as any).user; 
  res.json({ success: true, user });
};







// logout

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully!" });
};
