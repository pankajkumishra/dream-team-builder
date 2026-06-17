export function EmptyDiscovery({ guidance }: { guidance?: string }) {
  return (
    <div className="card text-center" role="status">
      <p className="text-slate-600">No compatible teammates found yet.</p>
      <p className="mt-2 text-sm text-slate-500">
        {guidance ?? 'Try broadening your search criteria or invite others to join the platform.'}
      </p>
    </div>
  );
}
