import React from 'react';
import { QueueStatusBoard as QueueBoard } from '../components/queue/QueueStatusBoard';

export function QueueStatusBoardPage() {
  // In a real app, this would come from route params or props
  const outletId = 'outlet-001';

  return <QueueBoard outletId={outletId} />;
}