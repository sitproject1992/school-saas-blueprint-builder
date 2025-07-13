import React from 'react';
import { useSchool } from '@/hooks/useSchool';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SchoolSwitcher: React.FC = () => {
  const { school, schools, switchSchool, isLoading } = useSchool();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex items-center space-x-2">
      <Select value={school?.id} onValueChange={switchSchool}>
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
    </div>
  );
};

export default SchoolSwitcher;
