import ManageUserRoleMembers from "@/modules/security/roles-management/members/view/page";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ role_id: string }>;
}) {
  const { role_id } = await params;
  return <ManageUserRoleMembers roleId={Number(role_id)} />;
}
