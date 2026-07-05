export default function DashboardLoading() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-blue border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading mission control...</p>
      </div>
    </div>
  );
}
