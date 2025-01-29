import { DataTable } from "./data-table";
import { getTableData } from "./request";

async function UserHistoryTable() {
  const { data, userData } = await getTableData();

  return (
    <DataTable data={data.map(d => ({ ...d, current_user_id: userData.id }))} />
  );
}

export { UserHistoryTable };
