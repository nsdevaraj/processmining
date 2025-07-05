
export default function CaseReplay() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Case Replay</h1>
        <p className="text-muted-foreground">
          Step-by-step visualization of individual process instances
        </p>
      </div>
      <div className="bg-card p-10 rounded-lg border flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Case replay feature under development</p>
          <p className="text-muted-foreground mt-2">
            This page will allow you to select a case ID and replay the full process flow step by step,
            showing timestamps, responsible actors, and delay points with export capability.
          </p>
        </div>
      </div>
    </div>
  );
}
