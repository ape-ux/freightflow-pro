import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDispatches } from "@/mocks/data";
import { Plus, Truck } from "lucide-react";

export default function Dispatches() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch Board</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track active shipments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Dispatch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Dispatches ({mockDispatches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Dispatch board implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
