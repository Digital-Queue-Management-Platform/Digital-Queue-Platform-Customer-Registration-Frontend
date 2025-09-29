import { QueueStatusBoard as QueueBoard } from '../components/queue/QueueStatusBoard';

export function QueueStatusBoardPage() {
  // In a real app, this would come from route params or props
  const outletId = 'cmg5dtc320000m4m26o15ce8d'; // Downtown Branch

  return (
    <div className="space-y-6">
      <QueueBoard outletId={outletId} />
    </div>
  );
}