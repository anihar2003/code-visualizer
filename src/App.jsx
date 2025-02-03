import Visualizer from "./components/Visualizer"
import Code from "./components/Code";

function App() {
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex items-center justify-between bg-gray-800 text-white p-2">
        <button className="text-sm font-semibold bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
        <a 
          href="https://anihar2003.github.io/data_struture_visualizer/index_main.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-semibold bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
        Back
        </a>
        </button>
        <div className="text-xl font-bold">Code Viz</div>
        <div className="w-16"></div>
      </div>
      <div className="flex flex-grow">
        <div className="w-1/2 bg-black">
          <Code/>
        </div>
        <div 
        className="w-1/2 bg-white" 
        style={{ backgroundColor: '#111827'}}
      >
        <Visualizer />
      </div>

      </div>
    </div>
  );
}

export default App;
