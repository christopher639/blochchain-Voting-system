export default function BlockchainLog(){
  return (
    <div>
      <h1 className="text-2xl font-semibold">Blockchain / Audit Log</h1>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Search by tx hash or student ID.</div>
        <table className="w-full text-sm mt-3">
          <thead className="text-left text-xs text-gray-500"><tr><th>Tx Hash</th><th>Action</th><th>Student ID</th><th>Timestamp</th><th>Block</th></tr></thead>
          <tbody>
            <tr className="border-t"><td>0xabc123</td><td>Candidate registration</td><td>U12345</td><td>2026-08-01 12:00</td><td>12345</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
