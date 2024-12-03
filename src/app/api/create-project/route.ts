import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { Console } from "console";

export async function POST(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const { title, description, teamMembers, WorkspaceId } = await request.json();
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const userId = Number(user.id);

  if (!title) {
    return NextResponse.json(
      {
        success: false,
        message: "Title is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const data: any = {
      title,
      userId,
    };

    if (description) {
      data.description = description;
    }

    if (teamMembers && teamMembers.length > 0) {
      data.teamMembers = {
        connect: teamMembers.map((id: number) => ({ id })),
      };
    }

    if (WorkspaceId) {
      data.workspaces = {
        connect: { id: WorkspaceId },
      };
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        userId,
        description,
        collaborations: {
          create: {
            userId: userId,
            status: "ACCEPTED", // Project owner is automatically accepted as a collaborator
          },
        },
      },
      include: {
        collaborations: true,
      },
    });

    if (!newProject) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not create project",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project: newProject,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create new project, try again afeter sometime",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const userId = Number(user.id);

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            collaborations: {
              some: {
                userId: userId,
                status: "ACCEPTED",
              },
            },
          },
        ],
      },
      include: {
        owner: true,
        teamMembers: true,
        openBoard: true,
        workspaces: true,
        collaborations: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        projects,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not fetch projects",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: NextRequest) {
  const prisma = await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const userId = Number(user.id);
  const { title, description, WorkspaceId } = await request.json();
  const { searchParams } = new URL(request.url);
  const projectId = Number(searchParams.get("projectid"));

  if (!projectId) {
    return NextResponse.json(
      {
        success: false,
        message: "Project ID is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        {
          status: 404,
        },
      );
    }

    const data: any = {};

    if (title) {
      data.title = title;
    }

    if (description) {
      data.description = description;
    }

    if (WorkspaceId) {
      data.workspaces = {
        connect: { id: WorkspaceId },
      };
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully",
        project: updatedProject,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not update project",
      },
      {
        status: 500,
      },
    );
  }
}

// export async function DELETE(request: NextRequest) {
//   const prisma = await dbconnect();
//   const session = await getServerSession(authOptions);
//   const user: User = session?.user as User;

//   if (!session || !user) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "You are not authenticated",
//       },
//       {
//         status: 401,
//       }
//     );
//   }

//   const userId = Number(user.id);
//   const { searchParams } = new URL(request.url);
//   const projectId = Number(searchParams.get("projectid"));

//   if (!projectId) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Project ID is required",
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   try {
//     const project = await prisma.project.findFirst({
//       where: {
//         id: projectId,
//         userId,
//       },
//     });

//     if (!project) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Project not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     await prisma.$transaction([
//       prisma.projectTeamMember.deleteMany({
//         where: { projectId: projectId }
//       }),
//       prisma.workspaceProject.deleteMany({
//         where: { projectId: projectId }
//       }),
//       prisma.projectCollaboration.deleteMany({
//         where: { projectId: projectId }
//       }),
//       prisma.project.delete({
//         where: {
//           id: projectId,
//         },
//       })
//     ]);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Project deleted successfully",
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Could not delete project",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
