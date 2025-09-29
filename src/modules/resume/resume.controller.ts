import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { resumeService } from "./resume.service";




export const createProfessionalResume = catchAsync(async (req:Request, res:Response) => {

    const resume = await resumeService

})