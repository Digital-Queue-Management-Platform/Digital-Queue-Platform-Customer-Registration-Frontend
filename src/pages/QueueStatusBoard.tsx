import { QueueStatusBoard as QueueBoard } from '../components/queue/QueueStatusBoard';

export function QueueStatusBoardPage() {
  // Get the real outlet ID from environment variables
  const outletId = import.meta.env.VITE_OUTLET_ID || 'cmg528re20000x8746qbly7ag';

  return (
    <div className="space-y-6">
      <QueueBoard outletId={outletId} />
    </div>
  );
}