/**
 * Prisma Seed Script — SmartAttendance AI
 * Creates dummy users for testing all three roles.
 *
 * Users:
 *   Students  (5): student1@test.com … student5@test.com
 *   Teachers  (5): teacher1@test.com … teacher5@test.com
 *   Admins    (2): admin1@test.com, admin2@test.com
 *
 * Password for ALL: Password@123!
 */

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;
const PASSWORD = "Password@123!";

// ─── User definitions ─────────────────────────────────────────────────────────

const users: { fullName: string; email: string; role: Role }[] = [
  // Students
  { fullName: "Arjun Sharma",    email: "student1@test.com", role: "STUDENT" },
  { fullName: "Priya Patel",     email: "student2@test.com", role: "STUDENT" },
  { fullName: "Rahul Verma",     email: "student3@test.com", role: "STUDENT" },
  { fullName: "Sneha Reddy",     email: "student4@test.com", role: "STUDENT" },
  { fullName: "Karan Mehta",     email: "student5@test.com", role: "STUDENT" },

  // Teachers
  { fullName: "Dr. Anita Singh",    email: "teacher1@test.com", role: "TEACHER" },
  { fullName: "Prof. Ravi Kumar",   email: "teacher2@test.com", role: "TEACHER" },
  { fullName: "Ms. Deepa Nair",     email: "teacher3@test.com", role: "TEACHER" },
  { fullName: "Mr. Suresh Iyer",    email: "teacher4@test.com", role: "TEACHER" },
  { fullName: "Dr. Meena Joshi",    email: "teacher5@test.com", role: "TEACHER" },

  // Admins
  { fullName: "Admin Kartik",       email: "admin1@test.com",   role: "ADMIN" },
  { fullName: "Admin Pradeep",      email: "admin2@test.com",   role: "ADMIN" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting seed...\n");

  const passwordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  console.log(`🔐  Password hashed (bcrypt, ${SALT_ROUNDS} rounds)\n`);

  let created = 0;
  let skipped = 0;

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });

    if (existing) {
      console.log(`⏭   Skipped  [${u.role.padEnd(7)}]  ${u.email}  (already exists)`);
      skipped++;
      continue;
    }

    await prisma.user.create({
      data: {
        fullName:     u.fullName,
        email:        u.email,
        passwordHash: passwordHash,
        role:         u.role,
        isActive:     true,
      },
    });

    console.log(`✅  Created  [${u.role.padEnd(7)}]  ${u.email}`);
    created++;
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Created : ${created}`);
  console.log(`  Skipped : ${skipped}`);
  console.log(`  Total   : ${users.length}`);
  console.log(`─────────────────────────────────────────`);
  console.log(`\n🎉  Seed complete!`);
  console.log(`\n📋  Login credentials:`);
  console.log(`    Password (all users): ${PASSWORD}\n`);

  const roleGroups: Record<Role, typeof users> = { STUDENT: [], TEACHER: [], ADMIN: [] };
  users.forEach((u) => roleGroups[u.role].push(u));

  for (const [role, list] of Object.entries(roleGroups)) {
    console.log(`  ${role}:`);
    list.forEach((u) => console.log(`    ${u.email}`));
  }
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
