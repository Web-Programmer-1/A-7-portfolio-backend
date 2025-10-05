import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { resumeService } from "./resume.service";
import { prisma } from "../../config/db";




export const createProfessionalResume = catchAsync(async (req: Request, res: Response) => {

  const userId = (req as any).user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Please login first",
    });
  }

  const resume = await resumeService.resumeCreate(req.body, userId);

  res.status(201).json({
    success: true,
    message: "Resume Created Successfully!",
    data: resume,
  });
});







export const updateResume = catchAsync(async (req:Request, res:Response) => {

        
       
    const resumeUpdate = await resumeService.resumeUpdate(Number(req.params.id), req.body)

    res.status(200).send({
        success:true,
        message:"Resume updated Successfully!!!",
        data:resumeUpdate
    })



});


export const getAllResume = catchAsync(async (req:Request, res:Response) => {

    const resume = await resumeService.getAllResume();

    res.status(200).send({
        success:true,
        message:"All Resume Retrive Successfully!!",
        data:resume
    })


});


export const deleteResume =  catchAsync(async (req:Request, res:Response) => {

    const resume = await resumeService.deleteResume(Number(req.params.id));

    res.status(200).send({
        success:true,
        message:" Unique Resume Deleted Successfully!!",
        data:resume
    })


});






// Generate PDF Resume
export const generateResumePDFController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;  
    const resume = await prisma.resume.findFirst({
      where: { userId: userId },
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const pdfBuffer = await resumeService.generateResumePDF(resume); 
    res.contentType("application/pdf");
    res.send(pdfBuffer);

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
