import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: "Funcionario no encontrado" }, { status: 404 });
    }

    // Transformar al formato esperado por el frontend
    const transformedEmployee = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone || 'No proporcionado',
      position: employee.position,
      department: employee.department || 'Sin asignar',
      status: employee.status,
      hireDate: employee.hireDate.toISOString().split('T')[0],
      salary: employee.salary || 0,
      address: employee.address || 'No proporcionada',
      avatar: employee.avatar || null,
      supervisor: employee.supervisorId || null,
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString()
    };

    return NextResponse.json({ success: true, employee: transformedEmployee });

  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener el funcionario" 
    }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, position, department, status, salary, address, supervisorId } = body;

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        position,
        department,
        status,
        salary: salary ? parseFloat(salary) : null,
        address,
        supervisorId
      }
    });

    return NextResponse.json({ 
      success: true, 
      employee: updatedEmployee 
    });

  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al actualizar el funcionario" 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Funcionario eliminado correctamente" 
    });

  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al eliminar el funcionario" 
    }, { status: 500 });
  }
}
