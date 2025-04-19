import Button from '@/components/Button';

export default function GameToolsService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Logic & Strategy Tools</h1>
        <p className="text-xl text-gray-600">Advanced tools for game analysis and strategy</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>What I Offer</h2>
        <p>
          I develop specialized tools for analyzing game states, evaluating strategies, and
          supporting decision-making in complex games. My solutions help game designers and players
          understand and optimize their gameplay.
        </p>

        <h2>Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Analysis Tools</h3>
            <ul className="list-disc pl-4">
              <li>Game state parsing</li>
              <li>Deck analysis</li>
              <li>Strategy evaluation</li>
              <li>Probability calculation</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Technical Capabilities</h3>
            <ul className="list-disc pl-4">
              <li>JSON-based state management</li>
              <li>Heuristic evaluation</li>
              <li>Logic tree construction</li>
              <li>Performance optimization</li>
            </ul>
          </div>
        </div>

        <h2>Example Projects</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">MTG Analyzer</h3>
          <ul className="list-disc pl-6">
            <li>JSON-based game state parsing</li>
            <li>Optimal play suggestions</li>
            <li>Deck analysis and recommendations</li>
            <li>Advanced logic tree construction</li>
            <li>Heuristic evaluation system</li>
          </ul>
        </div>

        <h2>Development Process</h2>
        <ol>
          <li>
            <strong>Game Analysis:</strong> We study the game mechanics and identify key decision
            points
          </li>
          <li>
            <strong>Tool Design:</strong> I create a system architecture for analyzing and
            evaluating game states
          </li>
          <li>
            <strong>Implementation:</strong> I build and test the analysis tools
          </li>
          <li>
            <strong>Optimization:</strong> We refine the tools for accuracy and performance
          </li>
          <li>
            <strong>Support:</strong> Ongoing updates and improvements
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <Button href="/contact" variant="primary" size="lg">
          Build Your Game Tool
        </Button>
      </div>
    </div>
  );
}
