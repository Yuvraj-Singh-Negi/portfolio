import { NextResponse } from "next/server";
import { deployProject } from "@/services/deployment";

export async function POST(request: Request) {
  const body = await request.json();
  const { projectId, userId, name } = body;

  if (!projectId || !userId) {
    return NextResponse.json(
      { error: "projectId and userId are required" },
      { status: 400 }
    );
  }

  try {
    const result = await deployProject({ projectId, userId, name });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deployment failed";
    const isUserError =
      message.includes("not found") ||
      message.includes("Access denied") ||
      message.includes("requires a PRO") ||
      message.includes("has no files");

    return NextResponse.json(
      { error: message },
      { status: isUserError ? 400 : 500 }
    );
  }
}
