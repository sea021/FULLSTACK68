import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await prisma.products.findMany();
        return NextResponse.json({ data } , { status: 200 });
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
                description: body.description,
                category: body.category,
            }
        });
        return NextResponse.json({ product } , { status: 200 } );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        await prisma.products.delete({ where: { id: body.id } });
        return NextResponse.json({ message: "Deleted successfully" } , { status: 200 }) ;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const updated = await prisma.products.update({
            where: { id: body.id },
            data: {
                name: body.name,
                price: body.price,
                description: body.description,
                category: body.category,
                image: body.image,
            },
        });

        return NextResponse.json({ success: true, product: updated }, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}