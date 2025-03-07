import {
  ChessPage,
  ChessPageContent,
  ChessPageDescription,
  ChessPageHeader,
  ChessPageTitle,
} from "@/components/chess-page";

function ProfileLayout({children}: {children: React.ReactNode}) {
  return (
    <ChessPage>
      <ChessPageHeader>
        <ChessPageTitle>Profile</ChessPageTitle>
        <ChessPageDescription>View and edit your profile</ChessPageDescription>
      </ChessPageHeader>
      <ChessPageContent>{children}</ChessPageContent>
    </ChessPage>
  );
}

export default ProfileLayout;
