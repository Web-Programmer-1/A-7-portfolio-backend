
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { ILogin } from "./auth.interface";
import jwt, { SignOptions }  from "jsonwebtoken"
import { Response } from "express";



// Create a User Account 
const userCreate = async (payload: any) => {
  const { email, password } = payload;


  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User Already Exist");
  }

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


// Login Form the User  Local Development 

// const userLogin = async (payload:ILogin) => {
//     const user = await prisma.user.findUnique({
//         where:{
//             email:payload.email
//         }
//     });

//     if(!user){
//         throw new Error("User Not Found IN DB")
//     };

//     const isMatchPassword = await bcrypt.compare(payload.password, user.password);

//     if(!isMatchPassword){
//         throw new Error("Password Did't Match")
//     };

//     // JWT Token for Using Role Base Systerms 

  

//     const token = jwt.sign(
//         {
//             userId:user.id,
//             role:user.role,
//         },
//         process.env.JWT_SECRET_KEY as string ,
//         {
//             expiresIn:process.env.JWT_EXPIRE_KEY as string || "10d"
//         }

//     );



//   //     // Cookie Set
//   // res.cookie("token", token, {
//   //   httpOnly: true,
//   //   secure: process.env.NODE_ENV === "production",
//   //   sameSite: "strict",
//   //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//   // });



//     return {
//       user,
//       token
//     }

  




// };



  //  for using Production and HTTPS secure



// export const userLogin = async (payload: ILogin, res: Response) => {
//   const user = await prisma.user.findUnique({
//     where: { email: payload.email },
//   });

//   if (!user) {
//     throw new Error("User Not Found in DB");
//   }

//   const isMatchPassword = await bcrypt.compare(payload.password, user.password);
//   if (!isMatchPassword) {
//     throw new Error("Password Didn't Match");
//   }



//   const token = jwt.sign(
//     { userId: user.id, role: user.role },
//     process.env.JWT_SECRET_KEY as string,
//     { expiresIn: process.env.JWT_EXPIRE_KEY || "10d" }
//   );



//    res.cookie("token", token, {
//   httpOnly: true,
//   secure: false, 
//   sameSite: "lax", 
//   maxAge: 30 * 24 * 60 * 60 * 1000,
// });


//   return {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   };
// };






export const userLogin = async (payload: ILogin, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("User Not Found in DB");
  }

  const isMatchPassword = await bcrypt.compare(payload.password, user.password);
  if (!isMatchPassword) {
    throw new Error("Password Didn't Match");
  }



  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: (process.env.JWT_EXPIRE_KEY as string) || "10d" } as SignOptions
  );



   res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", 
  maxAge: 30 * 24 * 60 * 60 * 1000,
});


  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
















export const allUsers = async ({ page = 1, limit = 10, email, role }: any) => {
  const skip = (page - 1) * limit;

  const where:any= {};

  if (email) {
    where.email = {
      contains: email, 
      mode: "insensitive", 
    };
  }

  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};







export const authService = {
  userCreate,
  userLogin,
  allUsers
};
