// app/api/user/route.ts (Main CRUD Routes)
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface UserBody {
    id?: string;
    username: string;
    email: string;
    password: string;
    role?: string;
}

interface UpdateUserData {
    username?: string;
    email?: string;
    role?: string;
    password?: string;
}


// GET - ดึงรายการผู้ใช้ทั้งหมด
export async function GET() {
    try {
        const data = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // ไม่ส่ง password กลับไป
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
}

// POST - สร้างผู้ใช้ใหม่
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as UserBody;

        if (!body) {
            return NextResponse.json({
                message: "Body Invalid",
            });
        }

        if (!body.email || !body.password || !body.username) {
            return NextResponse.json({
                message: "Please provide email, password and username",
            });
        }

        // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: body.username },
                    { email: body.email.toLowerCase() }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({
                message: "Username or email already exists",
            });
        }

        // Hash password ด้วย SHA256
        const hashPassword = createHash("sha256")
            .update(body.password)
            .digest("hex");

        const user = await prisma.user.create({
            data: {
                email: body.email.toLowerCase(),
                password: hashPassword,
                username: body.username,
                role: body.role || "user"
            },
        });

        return NextResponse.json({
            status: "Success",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error creating user: " + error,
        }, { status: 500 });
    }
}

// PUT - อัปเดตผู้ใช้
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json() as UserBody;

        if (!body.id) {
            return NextResponse.json({
                message: "User ID is required"
            }, { status: 400 });
        }

        // ตรวจสอบว่าผู้ใช้นี้มีอยู่หรือไม่
        const existingUser = await prisma.user.findUnique({
            where: { id: body.id }
        });

        if (!existingUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 });
        }

        // ตรวจสอบว่า username หรือ email ซ้ำกับคนอื่นหรือไม่
        if (body.username || body.email) {
            const duplicateUser = await prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: body.id } }, // ไม่ใช่ตัวเอง
                        {
                            OR: [
                                body.username ? { username: body.username } : {},
                                body.email ? { email: body.email.toLowerCase() } : {}
                            ].filter(condition => Object.keys(condition).length > 0)
                        }
                    ]
                }
            });

            if (duplicateUser) {
                return NextResponse.json({
                    message: "Username or email already exists"
                }, { status: 400 });
            }
        }

        // เตรียมข้อมูลสำหรับอัปเดต
        const updateData: UpdateUserData = {};

        if (body.username) updateData.username = body.username;
        if (body.email) updateData.email = body.email.toLowerCase();
        if (body.role !== undefined) updateData.role = body.role || "user";

        // ถ้ามีการส่ง password ใหม่มา ให้ hash ก่อน
        if (body.password && body.password.trim() !== '') {
            updateData.password = createHash("sha256")
                .update(body.password)
                .digest("hex");
        }


        // อัปเดตผู้ใช้
        const updated = await prisma.user.update({
            where: { id: body.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return NextResponse.json({
            success: true,
            user: updated
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({
            message: "Error updating user: " + error
        }, { status: 500 });
    }
}

// DELETE - ลบผู้ใช้
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json({
                message: "User ID is required"
            }, { status: 400 });
        }

        // ตรวจสอบว่าผู้ใช้นี้มีอยู่หรือไม่
        const existingUser = await prisma.user.findUnique({
            where: { id: body.id }
        });

        if (!existingUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 });
        }

        await prisma.user.delete({
            where: { id: body.id }
        });

        return NextResponse.json({
            message: "User deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({
            message: "Error deleting user: " + error
        }, { status: 500 });
    }
}