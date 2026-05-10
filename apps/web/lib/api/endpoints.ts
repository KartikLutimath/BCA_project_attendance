export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  // Attendance
  ATTENDANCE: {
    MARK: "/attendance/mark",
    HISTORY: "/attendance/history",
    SUMMARY: "/attendance/summary",
    SESSION: (id: string) => `/attendance/session/${id}`,
    OVERRIDE: (id: string) => `/attendance/${id}/override`,
    APPROVE: (id: string) => `/attendance/${id}/approve`,
    REJECT: (id: string) => `/attendance/${id}/reject`,
    MARK_ABSENTEES: "/attendance/mark-absentees",
  },

  // Geofence
  GEOFENCE: {
    VERIFY: "/geofence/verify",
    CLASSROOM: (id: string) => `/geofence/classroom/${id}`,
    CLASSROOMS: "/geofence/classrooms",
    UPDATE_CLASSROOM: (id: string) => `/geofence/classroom/${id}`,
    DISTANCE: "/geofence/distance",
  },

  // Timetables
  TIMETABLES: {
    LIST: "/timetables",
    CREATE: "/timetables",
    BY_ID: (id: string) => `/timetables/${id}`,
    SECTION: (id: string) => `/timetables/section/${id}`,
    TEACHER: (id: string) => `/timetables/teacher/${id}`,
    DAY: (sectionId: string, day: string) => `/timetables/section/${sectionId}/day/${day}`,
  },

  // Classrooms
  CLASSROOMS: {
    LIST: "/classrooms",
    CREATE: "/classrooms",
    BY_ID: (id: string) => `/classrooms/${id}`,
    UPDATE: (id: string) => `/classrooms/${id}`,
    DELETE: (id: string) => `/classrooms/${id}`,
  },

  // Departments
  DEPARTMENTS: {
    LIST: "/departments",
    CREATE: "/departments",
    BY_ID: (id: string) => `/departments/${id}`,
  },

  // Subjects
  SUBJECTS: {
    LIST: "/subjects",
    CREATE: "/subjects",
    BY_ID: (id: string) => `/subjects/${id}`,
  },

  // Sections
  SECTIONS: {
    LIST: "/sections",
    CREATE: "/sections",
    BY_ID: (id: string) => `/sections/${id}`,
  },

  // Users
  USERS: {
    LIST: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
  },
} as const;
