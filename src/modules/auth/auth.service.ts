
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { ILogin } from "./auth.interface";
import jwt from "jsonwebtoken"


// Create a User Account 
const userCreate = async (payload: any) => {
  const { email, password } = payload;


  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User Already Exist");
  }

  // 2. Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);


  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword, 
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  console.log(user);

  return user;
};


// Login Form the User 

const userLogin = async (payload:ILogin) => {
    const user = await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    });

    if(!user){
        throw new Error("User Not Found IN DB")
    };

    const isMatchPassword = await bcrypt.compare(payload.password, user.password);

    if(!isMatchPassword){
        throw new Error("Password Did't Match")
    };

    // JWT Token for Using Role Base Systerms 

  

    const token = jwt.sign(
        {
            userId:user.id,
            role:user.role,
        },
        process.env.JWT_SECRET_KEY as string ,
        {
            expiresIn:process.env.JWT_EXPIRE_KEY as string || "10d"
        }

    )



    return {
      user,
      token
    }

  




};


const allUsers = async () => {
  const user = await prisma.user.findMany();

  if(!user){
    throw new Error("User Not Found")
  }

  return user



}



export const authService = {
  userCreate,
  userLogin,
  allUsers
};
