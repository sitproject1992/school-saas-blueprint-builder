export const demoUsers = {
  admin: {
    id: "demo-admin",
    name: "Dr. Robert Anderson",
    email: "admin@skooler.com",
    role: "school_admin",
    title: "Principal",
    avatar: "/placeholder.svg",
    phone: "+1 (555) 123-4567",
    department: "Administration",
  },
  teacher: {
    id: "demo-teacher",
    name: "Ms. Sarah Johnson",
    email: "teacher@skooler.com",
    role: "teacher",
    title: "Mathematics Teacher",
    avatar: "/placeholder.svg",
    phone: "+1 (555) 234-5678",
    department: "Mathematics",
    experience: "8 years",
    qualification: "M.Ed in Mathematics",
  },
  student: {
    id: "demo-student",
    name: "Alex Johnson",
    email: "student@skooler.com",
    role: "student",
    grade: "Grade 9A",
    studentId: "STU2024001",
    avatar: "/placeholder.svg",
    dateOfBirth: "2009-05-15",
    address: "123 Main St, Anytown, ST 12345",
    parentContact: "+1 (555) 345-6789",
    bloodGroup: "A+",
    emergencyContact: "Sarah Williams - +1 (555) 345-6789",
  },
  parent: {
    id: "demo-parent",
    name: "Sarah Williams",
    email: "parent@skooler.com",
    role: "parent",
    avatar: "/placeholder.svg",
    phone: "+1 (555) 345-6789",
    occupation: "Software Engineer",
    address: "123 Main St, Anytown, ST 12345",
    children: [
      {
        id: 1,
        name: "Alex Johnson",
        grade: "Grade 9A",
        studentId: "STU2024001",
        attendance: 94.5,
        overallGrade: "A-",
        status: "active",
      },
      {
        id: 2,
        name: "Emma Johnson",
        grade: "Grade 6B",
        studentId: "STU2024078",
        attendance: 96.2,
        overallGrade: "A",
        status: "active",
      },
    ],
  },
};

export const demoSchoolData = {
  name: "Greenwood High School",
  address: "456 Education Lane, Learning City, LC 54321",
  phone: "+1 (555) 987-6543",
  email: "info@greenwoodhigh.edu",
  website: "www.greenwoodhigh.edu",
  principal: "Dr. Robert Anderson",
  established: "1985",
  totalStudents: 1342,
  totalTeachers: 89,
  totalClasses: 45,
  monthlyRevenue: 245800,
};

export const demoSubjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH",
    credits: 4,
    department: "Science",
  },
  {
    id: 2,
    name: "English Literature",
    code: "ENG",
    credits: 3,
    department: "Language Arts",
  },
  { id: 3, name: "Physics", code: "PHY", credits: 4, department: "Science" },
  { id: 4, name: "Chemistry", code: "CHEM", credits: 4, department: "Science" },
  { id: 5, name: "Biology", code: "BIO", credits: 4, department: "Science" },
  {
    id: 6,
    name: "History",
    code: "HIST",
    credits: 3,
    department: "Social Studies",
  },
  {
    id: 7,
    name: "Geography",
    code: "GEO",
    credits: 3,
    department: "Social Studies",
  },
  {
    id: 8,
    name: "Physical Education",
    code: "PE",
    credits: 2,
    department: "Physical Education",
  },
  { id: 9, name: "Art", code: "ART", credits: 2, department: "Fine Arts" },
  { id: 10, name: "Music", code: "MUS", credits: 2, department: "Fine Arts" },
];

export const demoClasses = [
  {
    id: 1,
    name: "Grade 8A",
    teacher: "Ms. Sarah Johnson",
    students: 32,
    subject: "Mathematics",
    room: "Room 201",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    attendance: 94,
  },
  {
    id: 2,
    name: "Grade 8B",
    teacher: "Mr. David Smith",
    students: 28,
    subject: "Science",
    room: "Lab 1",
    schedule: "Tue, Thu - 10:00 AM",
    attendance: 88,
  },
  {
    id: 3,
    name: "Grade 9A",
    teacher: "Mrs. Emily Davis",
    students: 30,
    subject: "English",
    room: "Room 105",
    schedule: "Mon, Wed, Fri - 11:00 AM",
    attendance: 95,
  },
  {
    id: 4,
    name: "Grade 9B",
    teacher: "Mr. James Wilson",
    students: 27,
    subject: "History",
    room: "Room 302",
    schedule: "Tue, Thu - 2:00 PM",
    attendance: 89,
  },
];

export const demoStudents = [
  {
    id: 1,
    name: "Alex Johnson",
    studentId: "STU2024001",
    grade: "Grade 9A",
    email: "alex.johnson@student.greenwood.edu",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "2009-05-15",
    address: "123 Main St, Anytown, ST 12345",
    parentName: "Sarah Williams",
    parentPhone: "+1 (555) 345-6789",
    attendance: 94.5,
    overallGrade: "A-",
    gpa: 3.7,
    status: "active",
  },
  {
    id: 2,
    name: "Emma Johnson",
    studentId: "STU2024078",
    grade: "Grade 6B",
    email: "emma.johnson@student.greenwood.edu",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "2012-08-22",
    address: "123 Main St, Anytown, ST 12345",
    parentName: "Sarah Williams",
    parentPhone: "+1 (555) 345-6789",
    attendance: 96.2,
    overallGrade: "A",
    gpa: 3.9,
    status: "active",
  },
  {
    id: 3,
    name: "Michael Brown",
    studentId: "STU2024015",
    grade: "Grade 8A",
    email: "michael.brown@student.greenwood.edu",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "2010-03-10",
    address: "456 Oak Ave, Springfield, ST 67890",
    parentName: "Linda Brown",
    parentPhone: "+1 (555) 456-7890",
    attendance: 91.8,
    overallGrade: "B+",
    gpa: 3.4,
    status: "active",
  },
];

export const demoTeachers = [
  {
    id: 1,
    name: "Ms. Sarah Johnson",
    email: "sarah.johnson@greenwood.edu",
    phone: "+1 (555) 234-5678",
    department: "Mathematics",
    subject: "Mathematics",
    qualification: "M.Ed in Mathematics",
    experience: "8 years",
    joinDate: "2016-08-15",
    classes: ["Grade 8A", "Grade 9B", "Grade 8B", "Grade 9A"],
    students: 128,
    status: "active",
  },
  {
    id: 2,
    name: "Mr. David Smith",
    email: "david.smith@greenwood.edu",
    phone: "+1 (555) 345-6789",
    department: "Science",
    subject: "Physics & Chemistry",
    qualification: "M.Sc in Physics",
    experience: "12 years",
    joinDate: "2012-01-10",
    classes: ["Grade 8B", "Grade 9A"],
    students: 85,
    status: "active",
  },
  {
    id: 3,
    name: "Mrs. Emily Davis",
    email: "emily.davis@greenwood.edu",
    phone: "+1 (555) 456-7890",
    department: "Language Arts",
    subject: "English Literature",
    qualification: "M.A in English",
    experience: "6 years",
    joinDate: "2018-09-01",
    classes: ["Grade 9A", "Grade 8A"],
    students: 95,
    status: "active",
  },
];

export const demoAttendance = {
  today: {
    total: 1342,
    present: 1234,
    absent: 108,
    late: 24,
    percentage: 92,
  },
  byClass: [
    { class: "Grade 8A", total: 32, present: 30, absent: 2, percentage: 94 },
    { class: "Grade 8B", total: 28, present: 25, absent: 3, percentage: 89 },
    { class: "Grade 9A", total: 30, present: 28, absent: 2, percentage: 93 },
    { class: "Grade 9B", total: 27, present: 24, absent: 3, percentage: 89 },
  ],
};

export const demoGrades = {
  alex: [
    {
      subject: "Mathematics",
      grade: "A",
      percentage: 92,
      teacher: "Ms. Johnson",
    },
    { subject: "Science", grade: "B+", percentage: 87, teacher: "Mr. Smith" },
    { subject: "English", grade: "A-", percentage: 89, teacher: "Mrs. Davis" },
    { subject: "History", grade: "B+", percentage: 85, teacher: "Mr. Wilson" },
    {
      subject: "Physical Education",
      grade: "A",
      percentage: 95,
      teacher: "Coach Brown",
    },
  ],
  emma: [
    {
      subject: "Mathematics",
      grade: "A+",
      percentage: 96,
      teacher: "Ms. Thompson",
    },
    { subject: "Science", grade: "A", percentage: 94, teacher: "Mr. Clark" },
    { subject: "English", grade: "A", percentage: 91, teacher: "Mrs. Wilson" },
    { subject: "Art", grade: "A+", percentage: 98, teacher: "Ms. Garcia" },
    { subject: "Music", grade: "A", percentage: 93, teacher: "Mr. Rodriguez" },
  ],
};

export const demoExams = [
  {
    id: 1,
    subject: "Mathematics",
    topic: "Algebra Test",
    date: "2024-12-15",
    time: "10:00 AM",
    duration: "2 hours",
    class: "Grade 9A",
    teacher: "Ms. Johnson",
    status: "scheduled",
  },
  {
    id: 2,
    subject: "Science",
    topic: "Chemistry Quiz",
    date: "2024-12-18",
    time: "2:00 PM",
    duration: "1 hour",
    class: "Grade 8B",
    teacher: "Mr. Smith",
    status: "scheduled",
  },
  {
    id: 3,
    subject: "English",
    topic: "Literature Essay",
    date: "2024-12-20",
    time: "9:00 AM",
    duration: "3 hours",
    class: "Grade 9A",
    teacher: "Mrs. Davis",
    status: "draft",
  },
];

export const demoAssignments = [
  {
    id: 1,
    subject: "English",
    title: "Essay on Shakespeare",
    description: "Write a 500-word essay on any Shakespeare play",
    dueDate: "2024-12-12",
    assignedDate: "2024-12-01",
    class: "Grade 9A",
    teacher: "Mrs. Davis",
    status: "pending",
  },
  {
    id: 2,
    subject: "History",
    title: "World War II Research",
    description: "Research project on causes and effects of WWII",
    dueDate: "2024-12-14",
    assignedDate: "2024-11-28",
    class: "Grade 9B",
    teacher: "Mr. Wilson",
    status: "in_progress",
  },
  {
    id: 3,
    subject: "Science",
    title: "Lab Report - Chemistry",
    description: "Complete lab report on chemical reactions experiment",
    dueDate: "2024-12-16",
    assignedDate: "2024-12-05",
    class: "Grade 8B",
    teacher: "Mr. Smith",
    status: "pending",
  },
];

export const demoEvents = [
  {
    id: 1,
    title: "Parent-Teacher Conference",
    date: "2024-12-15",
    time: "2:00 PM - 4:00 PM",
    type: "meeting",
    description: "Individual meetings with parents to discuss student progress",
    location: "School Auditorium",
    organizer: "Administration",
  },
  {
    id: 2,
    title: "Science Fair Exhibition",
    date: "2024-12-20",
    time: "10:00 AM - 2:00 PM",
    type: "event",
    description: "Annual science fair showcasing student projects",
    location: "Main Hall",
    organizer: "Science Department",
  },
  {
    id: 3,
    title: "Winter Break Begins",
    date: "2024-12-23",
    time: "All Day",
    type: "holiday",
    description: "School closed for winter holidays",
    location: "N/A",
    organizer: "Administration",
  },
];

export const demoFees = {
  structure: [
    {
      description: "Tuition Fee",
      amount: 8000,
      frequency: "Monthly",
      category: "Academic",
    },
    {
      description: "Lab Fee",
      amount: 1500,
      frequency: "Semester",
      category: "Facilities",
    },
    {
      description: "Library Fee",
      amount: 500,
      frequency: "Semester",
      category: "Facilities",
    },
    {
      description: "Activity Fee",
      amount: 1000,
      frequency: "Semester",
      category: "Extracurricular",
    },
    {
      description: "Transportation",
      amount: 2000,
      frequency: "Monthly",
      category: "Transport",
    },
    {
      description: "Meal Plan",
      amount: 1200,
      frequency: "Monthly",
      category: "Food",
    },
  ],
  pending: [
    {
      student: "Alex Johnson",
      description: "Tuition Fee - December",
      amount: 8000,
      dueDate: "2024-12-15",
      status: "overdue",
    },
    {
      student: "Emma Johnson",
      description: "Tuition Fee - December",
      amount: 7500,
      dueDate: "2024-12-15",
      status: "pending",
    },
    {
      student: "Alex Johnson",
      description: "Activity Fee",
      amount: 1500,
      dueDate: "2024-12-20",
      status: "pending",
    },
    {
      student: "Emma Johnson",
      description: "Lab Fee",
      amount: 1000,
      dueDate: "2024-12-20",
      status: "pending",
    },
  ],
};

export const demoMessages = [
  {
    id: 1,
    from: "Ms. Johnson (Mathematics)",
    to: "Sarah Williams",
    subject: "Alex's Progress Update",
    message:
      "Alex has shown excellent improvement in algebra. Keep up the good work!",
    time: "2 hours ago",
    read: false,
    type: "progress",
  },
  {
    id: 2,
    from: "School Administration",
    to: "All Parents",
    subject: "Holiday Schedule Notice",
    message:
      "Please note that school will be closed from Dec 23 to Jan 7 for winter holidays.",
    time: "1 day ago",
    read: false,
    type: "announcement",
  },
  {
    id: 3,
    from: "Mr. Smith (Science)",
    to: "Sarah Williams",
    subject: "Science Fair Preparation",
    message:
      "Emma needs to submit her science fair project proposal by next Friday.",
    time: "2 days ago",
    read: true,
    type: "reminder",
  },
];

export const demoAnnouncements = [
  {
    id: 1,
    title: "School Holiday Notice",
    message: "National Day holiday on Monday, December 25th",
    type: "holiday",
    priority: "medium",
    date: "2 hours ago",
    author: "Administration",
  },
  {
    id: 2,
    title: "New Teacher Joined",
    message: "Ms. Sarah Johnson joined as Math teacher",
    type: "staff",
    priority: "low",
    date: "1 day ago",
    author: "HR Department",
  },
  {
    id: 3,
    title: "Fee Reminder",
    message: "Monthly fee collection starts tomorrow",
    type: "finance",
    priority: "high",
    date: "3 days ago",
    author: "Finance Office",
  },
];

export const getDemoDataByRole = (role: string) => {
  switch (role) {
    case "school_admin":
      return {
        user: demoUsers.admin,
        school: demoSchoolData,
        totalStudents: demoSchoolData.totalStudents,
        totalTeachers: demoSchoolData.totalTeachers,
        totalClasses: demoSchoolData.totalClasses,
        totalRevenue: demoSchoolData.monthlyRevenue,
        students: demoStudents,
        teachers: demoTeachers,
        classes: demoClasses,
        attendance: demoAttendance,
        announcements: demoAnnouncements,
      };
    case "teacher":
      return {
        user: demoUsers.teacher,
        totalClasses: 4,
        totalStudents: 128,
        attendanceRate: 92.5,
        upcomingExams: 3,
        pendingLessonPlans: 2,
        averageGrade: "B+",
        classes: demoClasses.filter(
          (c) => c.teacher === demoUsers.teacher.name,
        ),
        exams: demoExams,
        assignments: demoAssignments,
      };
    case "student":
      return {
        user: demoUsers.student,
        overallGrade: "A-",
        attendanceRate: 94.5,
        upcomingExams: 2,
        pendingAssignments: 3,
        gpa: 3.7,
        grades: demoGrades.alex,
        exams: demoExams.filter((e) => e.class === demoUsers.student.grade),
        assignments: demoAssignments,
      };
    case "parent":
      return {
        user: demoUsers.parent,
        children: demoUsers.parent.children,
        totalAttendance: 95.3,
        upcomingEvents: 2,
        pendingFees: 18000,
        unreadMessages: 3,
        events: demoEvents,
        messages: demoMessages,
        fees: demoFees.pending,
      };
    default:
      return null;
  }
};
