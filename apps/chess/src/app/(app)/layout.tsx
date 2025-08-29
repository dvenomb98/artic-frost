import {AppSidebar} from "@/features/sidebar/app-sidebar";
import {createClient} from "@/services/supabase/server";
import {UserStoreProvider} from "@/services/supabase/user/provider";

async function Layout(props: LayoutProps<"/">) {
  const supabase = createClient();

  const {
    data: {user},
    error,
  } = await (await supabase).auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("User does not exist at app/(app)/layout.tsx");
  }

  return (
    <UserStoreProvider initialStoreData={{user}}>
      <AppSidebar>{props.children}</AppSidebar>
    </UserStoreProvider>
  );
}

export default Layout;
