import { Button } from '@/components/ui/button';

export default function GameToolsService() {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Logic & Strategy Tools</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tools for parsing complex game states, analyzing decks, and supporting turn-based game
          decision-making. Specializing in JSON-based game state analysis and heuristic evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Game state parsing and validation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Deck composition analysis</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Turn-based decision support</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Heuristic evaluation engines</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Strategy optimization algorithms</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Trading card game analysis tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Board game companion apps</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Strategy game decision support</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Game testing and simulation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Tournament preparation tools</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Development Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2">1. Game State Analysis</h3>
            <p className="text-gray-600">
              Define game state structure and implement parsing logic for accurate state representation.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">2. Algorithm Development</h3>
            <p className="text-gray-600">
              Create and optimize algorithms for game analysis and decision-making support.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">3. Tool Implementation</h3>
            <p className="text-gray-600">
              Build user-friendly interfaces and integrate analysis capabilities into practical tools.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a href="/contact">
          <Button variant="default" size="lg">
            Discuss Your Game Tool
          </Button>
        </a>
      </div>
    </div>
  );
}
