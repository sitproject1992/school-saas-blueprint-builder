// Demo authentication helper
import { supabase } from "@/integrations/supabase/client";

export interface DemoAccount {
  email: string;
  password: string;
  role: "school_admin" | "teacher" | "student" | "parent";
  first_name: string;
  last_name: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    email: "admin@skooler.com",
    password: "admin123",
    role: "school_admin",
    first_name: "Admin",
    last_name: "User",
  },
  {
    email: "teacher@skooler.com",
    password: "teacher123",
    role: "teacher",
    first_name: "Teacher",
    last_name: "Smith",
  },
  {
    email: "student@skooler.com",
    password: "student123",
    role: "student",
    first_name: "Student",
    last_name: "Johnson",
  },
  {
    email: "parent@skooler.com",
    password: "parent123",
    role: "parent",
    first_name: "Parent",
    last_name: "Williams",
  },
];

export async function ensureDemoDataExists() {
  try {
    // Check if demo school exists
    let { data: school, error: schoolError } = await supabase
      .from("schools")
      .select("id")
      .eq("subdomain", "demo")
      .single();

    if (!school && !schoolError?.code?.includes("PGRST116")) {
      console.log("Demo school not found, creating...");
      const { data: newSchool, error } = await supabase
        .from("schools")
        .upsert(
          [
            {
              name: "Skooler Demo School",
              subdomain: "demo",
              email: "admin@skooler.com",
              phone: "+1-555-0123",
              address: "123 Education Street, Learning City, LC 12345",
              subscription_status: "active",
            },
          ],
          {
            onConflict: "subdomain",
          },
        )
        .select()
        .single();

      if (error && !error.message.includes("duplicate")) {
        throw error;
      }
      school = newSchool || school;
      console.log("Demo school ensured:", school);
    }

    // Check if demo profiles exist
    for (const account of demoAccounts) {
      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", account.email)
        .single();

      if (!profile && !profileFetchError?.code?.includes("PGRST116")) {
        console.log(`Creating demo profile for ${account.email}`);
        // Note: In a real system, you'd create proper auth users
        // For demo purposes, we'll create profiles with mock user_ids
        const mockUserId = `demo-${account.role}-${Date.now()}`;

        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            user_id: mockUserId,
            email: account.email,
            first_name: account.first_name,
            last_name: account.last_name,
            role: account.role,
            school_id: school?.id,
            phone: `+1-555-010${demoAccounts.indexOf(account) + 1}`,
          },
          {
            onConflict: "email",
          },
        );

        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Error creating demo profile:", profileError);
        }
      }
    }
  } catch (error) {
    console.error("Error ensuring demo data exists:", error);
  }
}

export function isDemoAccount(
  email: string,
  password: string,
): DemoAccount | null {
  return (
    demoAccounts.find(
      (acc) => acc.email === email && acc.password === password,
    ) || null
  );
}
