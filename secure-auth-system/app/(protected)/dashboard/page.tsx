export default function Dashboard() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-neutral-950">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
          Welcome to your Dashboard
        </h1>
        <p className="text-neutral-400">
          We have prepared a special introductory video for you.
        </p>

        {/* Responsive Video Container (Aspect Ratio 16:9) */}
        <div className="relative w-full overflow-hidden rounded-xl border border-neutral-800 shadow-2xl pt-[56.25%] bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1&loop=1&playlist=dQw4w9WgXcQ"
            title="Important Dashboard Update"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
