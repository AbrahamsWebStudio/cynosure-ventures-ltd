import { NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/mpesa";

export async function POST(req: Request) {
  const { phone, amount } = await req.json();

  try {
    const data = await initiateStkPush(phone, amount);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}
