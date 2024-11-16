export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-400 animate-pulse">Loading IPSphere...</p>
      </div>
    </div>
  )
} 