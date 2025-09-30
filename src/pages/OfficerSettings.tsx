import { OfficerLayout } from '../components/officer/OfficerLayout';
import { Card } from '../components/ui/Card';

export function OfficerSettings() {
  return (
    <OfficerLayout title="Settings" subtitle="Manage your profile and system preferences">
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Page</h3>
          <p className="text-gray-600">Officer settings and preferences will be available here.</p>
        </Card>
      </div>
    </OfficerLayout>
  );
}