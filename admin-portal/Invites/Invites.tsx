import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";

export default function Invites() {
  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="Invites"
        description="Manage invites sent out from the platform"
      />
    </DashboardPageContainer>
  );
}
