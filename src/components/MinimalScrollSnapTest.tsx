export default function MinimalScrollSnapTest() {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <div className="snap-start h-screen bg-red-200 flex items-center justify-center">
        <h2 className="text-4xl">Card 1</h2>
      </div>
      <div className="snap-start h-screen bg-green-200 flex items-center justify-center">
        <h2 className="text-4xl">Card 2</h2>
      </div>
      <div className="snap-start h-screen bg-blue-200 flex items-center justify-center">
        <h2 className="text-4xl">Card 3</h2>
      </div>
    </div>
  );
} 