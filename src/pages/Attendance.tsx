import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { cn } from "@/lib/utils";

const fetchClasses = async () => {
  const { data, error } = await supabase.from("classes").select("id, name");
  if (error) throw new Error(error.message);
  return data;
};

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Select onValueChange={(value) => setSelectedClass(Number(value))}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes?.map((cls) => (
              <SelectItem key={cls.id} value={String(cls.id)}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {selectedClass && date && (
        <AttendanceTable classId={selectedClass} date={format(date, "yyyy-MM-dd")} />
      )}
    </div>
  );
}
