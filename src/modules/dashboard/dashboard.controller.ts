import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { dashboardServices, getAllVisitors, getTodayVisitors, getVisitorStats } from "./dashboard.service";




export const dashboardController = catchAsync( async (req:Request, res:Response) => {

    const statics = await dashboardServices.getDashboardStats();

    res.status(200).send({
        success:true,
        message:"Statics All Data Retrived Successfully",
        data:statics
    })

});


// --------------VisitorLogger Activity Log ----------------

export const getVisitorsController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await getAllVisitors(page, limit);

  res.json({
    success: true,
    ...data,
  });
};

export const getVisitorStatsController = async (req: Request, res: Response) => {
  const stats = await getVisitorStats();
  res.json({ success: true, stats });
};




// -----------------Today Total Visitor---------------



export const getTodayVisitorsController = async (req: Request, res: Response) => {
  const data = await getTodayVisitors();
  res.json({
    success: true,
    message: "Today's visitors fetched successfully",
    ...data,
  });
};

