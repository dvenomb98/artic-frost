import { UserService } from "@/services/supabase/api/server/user";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components";
import { format } from "date-fns";

async function ProfileAdditionals() {
  const data = await UserService.getUserData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            Email: <span className="text-muted-foreground">{data.email}</span>
          </li>
          <li>
            Phone:{" "}
            <span className="text-muted-foreground">
              {data.phone || "empty"}
            </span>
          </li>
          <li>
            Created at:{" "}
            <span className="text-muted-foreground">
              {format(new Date(data.created_at), "dd MMMM yyyy 'at' HH:mm")}
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export { ProfileAdditionals };
