import {AppSidebar} from "@/features/sidebar/app-sidebar";

function Layout(props: LayoutProps<"/">) {
  return <AppSidebar>{props.children}</AppSidebar>;
}

export default Layout;
