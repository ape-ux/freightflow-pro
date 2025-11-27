import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCarriers } from "@/mocks/data";
import { Plus, Users } from "lucide-react";

export default function Carriers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carriers</h1>
          <p className="text-muted-foreground mt-1">
            Manage carrier network and performance
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Carrier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Carriers ({mockCarriers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carrier directory implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
