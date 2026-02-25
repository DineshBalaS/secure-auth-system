import ClickCounter from "@/components/dashboard/click-counter";

export default function Dashboard() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-neutral-950">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
          Welcome to your Dashboard
        </h1>
        <p className="text-neutral-400">
          Take a break while your environment sets up.
        </p>

        {/* Dashboard Tools/Widgets Container */}
        <div className="w-full pt-8">
          <ClickCounter />
        </div>
      </div>
    </div>
  );
}
