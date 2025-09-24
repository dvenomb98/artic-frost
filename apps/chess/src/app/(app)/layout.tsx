import {AppSidebar} from "@/features/sidebar/app-sidebar";
import {createClient} from "@/services/supabase/server";
import {DbProfileTableRow} from "@/services/supabase/types";
import {UserStoreProvider} from "@/services/supabase/user/provider";
import {generateAnonymousProfile} from "@/services/supabase/user/utils";

async function Layout(props: LayoutProps<"/">) {
  const supabase = await createClient();

  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("User does not exist at app/(app)/layout.tsx");
  }

  let profile: DbProfileTableRow;

  if (user.is_anonymous) {
    profile = generateAnonymousProfile(user);
  } else {
    const {data: profileData} = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .throwOnError();

    profile = profileData;
  }

  return (
    <UserStoreProvider initialStoreData={{user, profile}}>
      <AppSidebar>{props.children}</AppSidebar>
    </UserStoreProvider>
  );
}

export default Layout;
