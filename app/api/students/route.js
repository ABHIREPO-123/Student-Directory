import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 4;
    const skip = (page - 1) * limit;

    const whereCondition = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };

    const total = await prisma.student.count({ where: whereCondition });

    const students = await prisma.student.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ students, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, course, status } = body;

    if (!name || !email || !course) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newStudent = await prisma.student.create({
      data: { name, email, course, status: status || "Active" },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 },
    );
  }
}
