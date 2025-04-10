import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Analytics dashboard is coming soon</h3>
            <p className="mt-1 text-sm text-gray-500">
              We're working hard to bring you detailed analytics for your videos across all platforms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
