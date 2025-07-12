import { useFeeData } from "@/hooks/useFeeData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeeStructure() {
  const { feeStructures, isLoadingStructures, errorStructures } = useFeeData();

  if (isLoadingStructures) return <div>Loading fee structures...</div>;
  if (errorStructures) return <div>Error: {errorStructures.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Structures</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Fee Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeStructures?.map((fs) => (
              <TableRow key={fs.id}>
                <TableCell>{fs.classes?.name}</TableCell>
                <TableCell>{fs.name}</TableCell>
                <TableCell>{fs.amount}</TableCell>
                <TableCell>{fs.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
