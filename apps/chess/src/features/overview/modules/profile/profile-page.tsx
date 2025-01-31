import { UserService } from "@/services/supabase/api/server/user";
import { ProfileAdditionals } from "./components/profile-additionals";
import { ProfileForm } from "./components/profile-form";
import { notFound } from "next/navigation";

async function ProfilePage() {
  const profileData = await UserService.getUserProfile();

  if (profileData.isAnonymous) {
    notFound();
  }

  return (
    <section className="space-y-16 max-w-[600px]">
      <ProfileForm profileData={profileData} />
      <ProfileAdditionals />
    </section>
  );
}

export { ProfilePage };
