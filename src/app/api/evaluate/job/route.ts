import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateJob } from "@/actions/evaluation/job";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { jobDescription } = await request.json();
    if (!jobDescription) {
        return NextResponse.json({ error: "Job description[jobDescription] is required" }, { status: 400 });
    }

    try {
        const resume = await prisma.resume.findFirst({
            where: {
                userId: session.user.id,
            },
        });
        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        const stringifiedContent = JSON.stringify(resume.content);
        const evaluation = await evaluateJob(jobDescription, stringifiedContent);
        
        return NextResponse.json({ message: "Job description received", evaluation });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
