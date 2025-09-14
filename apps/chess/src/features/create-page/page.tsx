import {ContentInset} from "@/components/content-inset";
import {CreateForm} from "./create-form";
import {LatestGames} from "./latest-games";

function Page() {
  return (
    <ContentInset className="space-y-10">
      <CreateForm />
      <LatestGames />
    </ContentInset>
  );
}

export {Page};
