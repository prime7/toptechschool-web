import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { JobService } from "@/service/Job.service";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { jobDescription, jobRole, resumeId } = await request.json();
    if (!jobDescription) {
        return NextResponse.json({ error: "Job description[jobDescription] is required" }, { status: 400 });
    }

    try {
        const result = await JobService.evaluateJobDescription(
            session.user.id,
            jobDescription,
            jobRole,
            resumeId
        );
        
        return NextResponse.json({ 
            message: "Job description evaluated successfully", 
            jobReview: result.jobReview,
            evaluation: result.evaluation 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
