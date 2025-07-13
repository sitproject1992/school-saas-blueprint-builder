import React from 'react';
import { useSchool } from '@/hooks/useSchool';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SchoolSwitcher() {
  const { school, schools, switchSchool, isLoading } = useSchool();

  if (isLoading) {
    return <div>Loading schools...</div>;
  }

  if (!school) {
    return <div>No school selected</div>;
  }

  return (
    <Select value={school.id} onValueChange={switchSchool}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a school" />
      </SelectTrigger>
      <SelectContent>
        {schools.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
