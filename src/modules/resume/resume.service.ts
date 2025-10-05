import { Prisma, Resume } from "@prisma/client"
import { prisma } from "../../config/db";
import { TDocumentDefinitions } from "pdfmake/interfaces";


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; 

(pdfMake as any).vfs = pdfFonts.vfs;






export const resumeCreate = async (
  payload: Prisma.ResumeCreateInput,
  userId: number
): Promise<Resume> => {
  if (!payload.fullName || !payload.email || !payload.phone) {
    throw new Error("Full name, email, and phone are required!");
  }

  const existing = await prisma.resume.findUnique({
    where: { email: payload.email },
  });
  if (existing) throw new Error("Resume already exists for this email!");

  // Validate array types
  if (payload.skills && !Array.isArray(payload.skills))
    throw new Error("Skills must be an array!");
  if (payload.certifications && !Array.isArray(payload.certifications))
    throw new Error("Certifications must be an array!");
  if (payload.languages && !Array.isArray(payload.languages))
    throw new Error("Languages must be an array!");

  const resume = await prisma.resume.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,

      education: payload.education as Prisma.InputJsonValue,
      experience: payload.experience as Prisma.InputJsonValue,
      projects: payload.projects as Prisma.InputJsonValue,

      skills: payload.skills || [],
      certifications: payload.certifications || [],
      languages: payload.languages || [],
      summary: payload.summary,
      portfolioUrl: payload.portfolioUrl || null,
      linkedinUrl: payload.linkedinUrl || null,
      githubUrl: payload.githubUrl || null,

     
      user: { connect: { id: userId } },
    },
  });

  return resume;
};










const resumeUpdate = async (id:number, payload:any) => {

    const resume = await prisma.resume.update({
        where:{id},
        data:payload
    });

    return resume


};

const getAllResume = async () => {
    const resume = await prisma.resume.findMany({
      include:{
        user:{
          select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createAt: true,
          
        },
        },
      }
    });
     
        if(resume.length === 0){
            throw new Error("No resumes found for this user")
        }
    return resume
};

// Deleted Resume 

const deleteResume = async (id:number) => {


  const existing = await prisma.resume.findUnique({
    where: { id },
  });

  if(!existing){
    throw new Error("Resume Not Found ")
  };

  if(existing.userId !==  existing.userId){
     throw new Error("You can only delete your own resume.");
  }
    
    const resume = await prisma.resume.delete({
        where:{id}
    });

    return resume


};



// Generated PDF Maker 




export const generateResumePDF = (resumeData: any) => {
  const { fullName, email, phone, address, education, experience, skills, certifications, languages, projects, summary, portfolioUrl, linkedinUrl, githubUrl } = resumeData;

  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: fullName, style: 'header' },
      { text: `Email: ${email}`, style: 'subheader' },
      { text: `Phone: ${phone}`, style: 'subheader' },
      { text: `Address: ${address}`, style: 'subheader' },

      { text: 'Summary', style: 'subheader' },
      { text: summary, style: 'content' },

      { text: 'Education', style: 'subheader' },
     
      { 
        ul: Array.isArray(education) ? education.map((edu: any) => `${edu.degree} from ${edu.institution}`) : [], 
        style: 'content' 
      },

      { text: 'Experience', style: 'subheader' },
      { ul: experience.map((exp: any) => `${exp.company}: ${exp.role}`), style: 'content' },

      { text: 'Skills', style: 'subheader' },
      { ul: skills, style: 'content' },

      { text: 'Certifications', style: 'subheader' },
      { ul: certifications, style: 'content' },

      { text: 'Languages', style: 'subheader' },
      { ul: languages, style: 'content' },

      { text: 'Projects', style: 'subheader' },
      { ul: projects.map((proj: any) => `${proj.name}: ${proj.description}`), style: 'content' },

      { text: 'Links', style: 'subheader' },
      { text: `Portfolio: ${portfolioUrl}`, style: 'content' },
      { text: `LinkedIn: ${linkedinUrl}`, style: 'content' },
      { text: `GitHub: ${githubUrl}`, style: 'content' },
    ],
    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      content: { fontSize: 12 },
    },
  };


  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  return new Promise<Buffer>((resolve, reject) => {
    pdfDocGenerator.getBuffer((buffer: Buffer) => {
      resolve(buffer);  
    });
  });
};






export const resumeService = {
    resumeCreate,
    resumeUpdate,
    getAllResume,
    deleteResume,
    generateResumePDF,
}