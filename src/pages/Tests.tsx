import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tests() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tests Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tests functionality is not yet implemented. The tests table needs to be created in the database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}