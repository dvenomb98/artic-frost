import {PageContainer} from "@/components/page-container";
import {Saves} from "./components/saves";
import {SavePreview} from "./components/save-preview";

function Page() {
  return (
    <PageContainer
      title="Position Library"
      description="Manage your saved chess positions and continue your games"
      className="grid gap-5">
      <SavePreview />
      <Saves />
    </PageContainer>
  );
}

export {Page};
