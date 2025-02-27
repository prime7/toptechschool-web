import { evaluateJob } from "@/actions/evaluate";
import { EvaluateJobInput } from "@/actions/evaluate/types";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    const body: EvaluateJobInput = await req.json();

    if (!body.resumeId || !body.jobDesc) {
      return NextResponse.json({
        error: "Missing required fields",
      }, { status: 400 });
    }

    const result = await evaluateJob(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
