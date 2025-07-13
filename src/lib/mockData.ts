// Mock data service for development
export interface Student {
  id: string;
  profile_id: string;
  school_id: string;
  class_id: string | null;
  admission_number: string;
  admission_date: string | null;
  blood_group: string | null;
  medical_conditions: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
  };
  classes: {
    name: string;
    section: string | null;
  } | null;
}

export interface Teacher {
  id: string;
  profile_id: string;
  school_id: string;
  employee_id: string;
  department: string | null;
  designation: string | null;
  salary: number | null;
  join_date: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
  };
}

export interface Class {
  id: string;
  name: string;
  section: string | null;
  grade: string | null;
  capacity: number | null;
  school_id: string;
  teacher_id: string | null;
  created_at: string;
  updated_at: string;
  teachers: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  } | null;
}

// Mock data
export const mockStudents: Student[] = [
  {
    id: '1',
    profile_id: '1',
    school_id: '1',
    class_id: '1',
    admission_number: 'STU001',
    admission_date: '2023-01-15',
    blood_group: 'A+',
    medical_conditions: null,
    emergency_contact_name: 'John Doe Sr.',
    emergency_contact_phone: '+1234567890',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z',
    profiles: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@student.com',
      phone: '+1234567890',
      date_of_birth: '2010-03-15',
      address: '123 Main St, City, State 12345'
    },
    classes: {
      name: 'Grade 8',
      section: 'A'
    }
  },
  {
    id: '2',
    profile_id: '2',
    school_id: '1',
    class_id: '1',
    admission_number: 'STU002',
    admission_date: '2023-01-20',
    blood_group: 'B+',
    medical_conditions: 'Asthma',
    emergency_contact_name: 'Jane Smith',
    emergency_contact_phone: '+1234567891',
    created_at: '2023-01-20T10:00:00Z',
    updated_at: '2023-01-20T10:00:00Z',
    profiles: {
      first_name: 'Emily',
      last_name: 'Smith',
      email: 'emily.smith@student.com',
      phone: '+1234567891',
      date_of_birth: '2010-05-22',
      address: '456 Oak Ave, City, State 12345'
    },
    classes: {
      name: 'Grade 8',
      section: 'A'
    }
  },
  {
    id: '3',
    profile_id: '3',
    school_id: '1',
    class_id: '2',
    admission_number: 'STU003',
    admission_date: '2023-02-01',
    blood_group: 'O-',
    medical_conditions: null,
    emergency_contact_name: 'Robert Johnson',
    emergency_contact_phone: '+1234567892',
    created_at: '2023-02-01T10:00:00Z',
    updated_at: '2023-02-01T10:00:00Z',
    profiles: {
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'michael.johnson@student.com',
      phone: '+1234567892',
      date_of_birth: '2009-08-10',
      address: '789 Pine St, City, State 12345'
    },
    classes: {
      name: 'Grade 9',
      section: 'B'
    }
  }
];

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    profile_id: '4',
    school_id: '1',
    employee_id: 'TCH001',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    salary: 60000,
    join_date: '2020-08-15',
    created_at: '2020-08-15T10:00:00Z',
    updated_at: '2020-08-15T10:00:00Z',
    profiles: {
      first_name: 'Sarah',
      last_name: 'Wilson',
      email: 'sarah.wilson@school.com',
      phone: '+1234567893',
      date_of_birth: '1985-04-12',
      address: '321 Elm St, City, State 12345'
    }
  },
  {
    id: '2',
    profile_id: '5',
    school_id: '1',
    employee_id: 'TCH002',
    department: 'English',
    designation: 'Teacher',
    salary: 55000,
    join_date: '2021-01-10',
    created_at: '2021-01-10T10:00:00Z',
    updated_at: '2021-01-10T10:00:00Z',
    profiles: {
      first_name: 'David',
      last_name: 'Brown',
      email: 'david.brown@school.com',
      phone: '+1234567894',
      date_of_birth: '1988-09-25',
      address: '654 Maple Ave, City, State 12345'
    }
  }
];

export const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Grade 8',
    section: 'A',
    grade: '8',
    capacity: 30,
    school_id: '1',
    teacher_id: '1',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
    teachers: {
      profiles: {
        first_name: 'Sarah',
        last_name: 'Wilson'
      }
    }
  },
  {
    id: '2',
    name: 'Grade 9',
    section: 'B',
    grade: '9',
    capacity: 25,
    school_id: '1',
    teacher_id: '2',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
    teachers: {
      profiles: {
        first_name: 'David',
        last_name: 'Brown'
      }
    }
  }
];

// Mock API service
export class MockApiService {
  private static delay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  static async getStudents(): Promise<Student[]> {
    await this.delay();
    return mockStudents;
  }

  static async getTeachers(): Promise<Teacher[]> {
    await this.delay();
    return mockTeachers;
  }

  static async getClasses(): Promise<Class[]> {
    await this.delay();
    return mockClasses;
  }

  static async createStudent(student: Partial<Student>): Promise<Student> {
    await this.delay();
    const newStudent: Student = {
      id: Date.now().toString(),
      profile_id: Date.now().toString(),
      school_id: '1',
      class_id: student.class_id || null,
      admission_number: student.admission_number || `STU${Date.now()}`,
      admission_date: new Date().toISOString().split('T')[0],
      blood_group: student.blood_group || null,
      medical_conditions: student.medical_conditions || null,
      emergency_contact_name: student.emergency_contact_name || null,
      emergency_contact_phone: student.emergency_contact_phone || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        first_name: student.profiles?.first_name || '',
        last_name: student.profiles?.last_name || '',
        email: student.profiles?.email || '',
        phone: student.profiles?.phone || null,
        date_of_birth: student.profiles?.date_of_birth || null,
        address: student.profiles?.address || null
      },
      classes: student.classes || null
    };
    mockStudents.push(newStudent);
    return newStudent;
  }

  static async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    await this.delay();
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    mockStudents[index] = { ...mockStudents[index], ...student };
    return mockStudents[index];
  }

  static async deleteStudent(id: string): Promise<void> {
    await this.delay();
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    mockStudents.splice(index, 1);
  }
}