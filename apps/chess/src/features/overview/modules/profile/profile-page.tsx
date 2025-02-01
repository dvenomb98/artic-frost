import { ProfileAdditionals } from "./components/profile-additionals";
import { ProfileForm } from "./components/profile-form";
import { getProfileData } from "./request";

async function ProfilePage() {
  const data = await getProfileData()

  return (
    <section className="space-y-16 max-w-[600px]">
      <ProfileForm profileData={data} />
      <ProfileAdditionals />
    </section>
  );
}

export { ProfilePage };
