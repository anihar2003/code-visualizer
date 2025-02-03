import React, { useState, useRef, useEffect } from 'react';
export let expression_array;
function Code() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const textareaRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);

  // Update line count when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  // Handle tab key
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      
      // Move cursor position after the tab
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
      }, 0);
    }
  };
  const G_API = "AIzaSyBaVRAhmgszP27nG1NsYgPAuG7Xq41_w5s";
  const executeCode = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual Gemini API endpoint and key
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${G_API}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `
                    ${code}
                    convert above code to only variable and array creation and variable and array assignemnts
                    and if any loops how many times a assignemnt takes palce u shud put tht expression in tht many times in array
                    if there are if conditions then u put tht assignements which are true
                    for inputs u give ur own and send another array of inputs u have given
                    if in code u get a expression with operators "arr[3]=a*c+d/arr[2]"
                    if and u encounter with uninitialized expression like
                    "int a"
                    "int arr[2]"
                    give expression like "int a = nd"
                    for array "give expresssion like "int arr[2] = [0,0]"
                    and use square brackets "[" not flower "{" 
                  convert to "arr[3] = 4 " (the expressions result as constant)!!!!important!!!!(no operators in expression not even sum += arr[0])
                    as code above convert it to array of expressions like example below
                    [
                      "int a = 3",
                      "int b = 4",
                      "int c = 0",
                      "int d = 2",
                      "int arr[4]=[1,2,3,4]",
                      "arr[3]=a*c+d/arr[2]",
                    ],
                    output should be
                    [
                    array_of_expressions,
                    ]
                    [
                    array_of_items tht are in console
                    ]
                     response shoould only contain array 
                     starts with [ and end with ] 
                    `
                }]
            }]
        })
    });
    const geminiResult = await geminiResponse.json();
    const analysisText = geminiResult.candidates[0].content.parts[0].text;
    
    // Remove any markdown formatting if present
    const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON string to get the arrays
    const analysis = JSON.parse(cleanText);
    
    // Format the response for display
    const formattedResponse = JSON.stringify(analysis, null, 2);

    // Log individual arrays
    console.log('Expressions:', analysis[0]);
    console.log('Console outputs:', analysis[1]);
    console.log('Input values:', analysis[2]); 
    expression_array = analysis[0];//export this variable
    const string_response = analysis[1].join(" ");
    setResponse(string_response);
    } catch (error) {
      setResponse('Error executing code: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white p-4 min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Code Editor Area */}
        <div className="relative rounded-lg overflow-hidden border border-gray-700">
          {/* Editor Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-400">editor</span>
          </div>
          
          {/* Editor Body */}
          <div className="relative flex">
            {/* Line Numbers */}
            <div className="py-3 px-4 bg-gray-800 text-gray-500 select-none font-mono text-sm min-w-[3rem] text-right">
              <pre className="leading-[1.5]">
                {Array.from({ length: lineCount }, (_, i) => i + 1).map((num) => (
                  `${num}\n`
                ))}
              </pre>
            </div>
            
            {/* Code Input Area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-900 text-white p-3 font-mono text-sm resize-none focus:outline-none flex-1 leading-[1.5]"
              style={{
                minHeight: '300px',
                tabSize: 4,
              }}
              placeholder="Write or paste your code here..."
              spellCheck="false"
            />
          </div>
        </div>

        {/* Execute Button */}
        <div className="flex justify-end">
          <button
            onClick={executeCode}
            disabled={isLoading || !code.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin h-4 w-4 mr-2" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Executing...
              </>
            ) : (
              'Execute Code'
            )}
          </button>
        </div>

        {/* Response Area */}
        {response && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Terminal</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default Code;