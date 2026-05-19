import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(request, { params }) {
  try {
    // console.log(params);

    const { id } = await params;
    const body = await request.json();

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // console.log(params);

    const { id } = await params;

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 },
    );
  }
}
