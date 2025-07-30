import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface RegisterBody {
  email: string;
  password: string;
  username: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;

    if (!body)
      return NextResponse.json({
        message: "Body Invalid",
      });

    if (!body.email || !body.password || !body.username)
      return NextResponse.json({
        message: "Please provide email and password and username",
      });

    const hashPassword = createHash("sha256")
      .update(body.password)
      .digest("hex");
    console.log("Hashed Password:", hashPassword);

    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      return NextResponse.json({
        message: "User is already exists",
      });
    }

    await prisma.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        username: body.username,
      },
    });

    return NextResponse.json({
      status: "Success",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error :" + error,
    });
  }
}
