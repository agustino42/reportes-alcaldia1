import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Definir tipos para evitar errores de TypeScript
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string | null;
  status: string;
  hireDate: Date;
  salary: number | null;
  address: string | null;
  avatar: string | null;
  supervisorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (department && department !== 'todos') {
      where.department = department;
    }
    
    if (status && status !== 'todos') {
      where.status = status;
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Transformar datos para el frontend
    const transformedEmployees = employees.map(employee => ({
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
    }));

    return NextResponse.json({ 
      success: true, 
      employees: transformedEmployees,
      total: transformedEmployees.length
    });

  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener los funcionarios" 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, position, department, salary, address, supervisorId, status } = body;

    // Validar que el email no exista
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmployee) {
      return NextResponse.json({ 
        success: false, 
        error: "El email ya está registrado" 
      }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        position,
        department,
        salary: salary ? parseFloat(salary) : null,
        address,
        supervisorId,
        status: status || "ACTIVE"
      }
    });

    return NextResponse.json({ 
      success: true, 
      employee 
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al crear el funcionario" 
    }, { status: 500 });
  }
}
