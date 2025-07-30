import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await prisma.products.findMany();
        return NextResponse.json({ data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const product = await prisma.products.create({
            data: {
                name: body.name,
                price: body.price,
                image: body.image,
                desciption: body.desciption,
                cetagory: body.cetagory,
            }
        });
        return NextResponse.json({ product });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        await prisma.products.delete({ where: { id: body.id } });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
    }
}