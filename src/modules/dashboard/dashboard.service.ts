
import { prisma } from "../../config/db"


const getDashboardStats  = async () => {

    const totalUsers = await prisma.user.count();
    const totalProject = await prisma.project.count();
    const totalBlogs = await prisma.blog.count();
    const totalResumes = await prisma.resume.count();

    const admins = await prisma.user.count({where:{role:"ADMIN"}});

    const normalUsers = await prisma.user.count({where:{role:"USER"}});

    const totalViews = await prisma.blog.aggregate({
        _sum: {
            views:true
        }
    });

    const recentBlog = await prisma.blog.findMany({
        orderBy:{
            createAt:"desc"
        }
    });

    const recentProject = await prisma.project.findMany({
        orderBy:{
            createAt:"desc"
        }
    });

    const recentResume = await prisma.resume.findMany({
        orderBy:{
            createAt:"desc"
        }
    });

    const topViews = await prisma.blog.findMany({
        orderBy: {
            views:"desc"
        },
        take:5,
    });

    return {
    totalUsers,
    admins,
    normalUsers,
    totalBlogs,
    totalResumes,
    totalProject,
    totalBlogViews: totalViews._sum.views || 0,
    recentBlog,
    recentResume,
    recentProject,
    topViews,
  };




};




// -------------Visitor Activity Log -------------------




export const getAllVisitors = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const visitors = await prisma.visitorLog.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.visitorLog.count();

  return {
    visitors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getVisitorStats = async () => {
  const totalVisitors = await prisma.visitorLog.count();

  // Unique visitors by IP
  const uniqueVisitors = await prisma.visitorLog.groupBy({
    by: ["ip"],
    _count: { ip: true },
  });

  const deviceStats = await prisma.visitorLog.groupBy({
    by: ["device"],
    _count: { device: true },
  });

  return {
    totalVisitors,
    uniqueVisitors: uniqueVisitors.length,
    deviceStats,
  };
};



// ------------- Today Active User -------------------------


// Get Today's Visitors
export const getTodayVisitors = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const count = await prisma.visitorLog.count({
    where: {
      createdAt: {
        gte: today, 
      },
    },
  });

  return { todayVisitors: count };
};







export const dashboardServices = {
    getDashboardStats,
}



