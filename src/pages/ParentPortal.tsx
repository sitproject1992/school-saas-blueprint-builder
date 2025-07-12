import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { StudentInfo } from "@/components/parent-portal/StudentInfo";
import { Button } from "@/components/ui/button";

const fetchChildren = async (parentId: string) => {
  const { data, error } = await supabase
    .from("parent_children")
    .select("students (*)")
    .eq("parent_id", parentId);
  if (error) throw new Error(error.message);
  return data.map((item: any) => item.students);
};

export default function ParentPortalPage() {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<any>(null);

  const { data: children, isLoading, error } = useQuery({
    queryKey: ["children", user?.id],
    queryFn: () => fetchChildren(user!.id),
    enabled: !!user,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (selectedChild) {
    return (
      <div>
        <Button onClick={() => setSelectedChild(null)} className="mb-4">
          &larr; Back to Children
        </Button>
        <StudentInfo student={selectedChild} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Children</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children?.map((child) => (
          <div key={child.id} className="p-6 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedChild(child)}>
            <h2 className="text-xl font-semibold">{child.first_name} {child.last_name}</h2>
            <p className="text-muted-foreground">{child.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
