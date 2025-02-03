// src/components/Visualizer.jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { useVariables } from "./useVariables";
import "../assets/main.css";
import {expression_array} from "./Code";
import { useState } from "react";

const Visualizer = forwardRef((props, ref) => {
  const svgRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current expression index
  const [isPaused, setIsPaused] = useState(false);

  const {
    elements,
    addVariable,
    handleMove,
    addArray,
    handleArrayMove,
    handle_constant_to_array_move,
    move_Constant_to_variable,
    handle_Array_to_variable,
    handle_Variable_to_array,
    handleArithmeticExpression, // now expecting four arguments in this function
  } = useVariables();

  // Helper function for delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper to find the index of an element based on a key
  const findIndexByValue = (key, value) => {
    if (key === "varName") {
      return elements.findIndex((obj) => obj.varName === value);
    } else if (key === "array_name") {
      return elements.findIndex((obj) => obj.array_name === value);
    }
    return -1;
  };

  let msec = 2700;
  const varsec = 3700;
  const arraysec = 2700;

  // Creation functions
  const createVar = (type, varName, value) => {
    addVariable(svgRef, varName, value, type);
    msec = 1000;
  };

  const createArray = (type, arrName, arrSize, values) => {
    addArray(svgRef, arrName, values, type);
    msec = 1000;
  };

  // The expression executor function parses a single expression
  const executeExpression = (expression) => {
    expression = expression.trim();
    // Check for type declarations for variable/array creation.
    if (/^(int|string)\s+/.test(expression)) {
      // Array creation: "int arr[5]=[2,3,4,5,6]"
      if ((expression.match(/\[/g) || []).length >= 2) {
        const arrayCreationRegex =
          /^(int|string)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\[(\d+)\]\s*=\s*\[(.+)\]$/;
        const match = expression.match(arrayCreationRegex);
        if (!match) {
          console.error("Invalid array creation expression: " + expression);
          return;
        }
        const type = match[1];
        const arrName = match[2];
        const arrSize = match[3];
        const valuesStr = match[4];
        const values = valuesStr.split(",").map((v) => v.trim());
        createArray(type, arrName, arrSize, values);
      } else {
        // Variable creation: "int num=65"
        const varCreationRegex =
          /^(int|string)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*(.+)$/;
        const match = expression.match(varCreationRegex);
        if (!match) {
          console.error("Invalid variable creation expression: " + expression);
          return;
        }
        const type = match[1];
        const varName = match[2];
        const value = match[3].trim();
        createVar(type, varName, value);
      }
      return;
    }

    // If no type declaration, treat it as an assignment.
    const exp = expression.replace(/\s+/g, "");
    const parts = exp.split("=");
    if (parts.length !== 2) {
      console.error("Invalid expression: " + expression);
      return;
    }
    const [left, right] = parts;

    // Regular expressions to classify tokens.
    const arrayRegex = /^([a-zA-Z_$][0-9a-zA-Z_$]*)\[(\d+)\]$/;
    const varRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
    const constantRegex = /^(\d+|'.'|".")$/;

    // Determine left token
    let leftType = "",
      leftName = "",
      leftIndex = null;
    if (arrayRegex.test(left)) {
      leftType = "array";
      const match = left.match(arrayRegex);
      leftName = match[1];
      leftIndex = match[2];
    } else if (varRegex.test(left)) {
      leftType = "variable";
      leftName = left;
    } else {
      console.error("Left-hand token not recognized: " + left);
      return;
    }

    // Determine right token – try simple cases first.
    let rightType = "",
      rightName = "",
      rightIndex = null;
    if (arrayRegex.test(right)) {
      rightType = "array";
      const match = right.match(arrayRegex);
      rightName = match[1];
      rightIndex = match[2];
    } else if (varRegex.test(right)) {
      rightType = "variable";
      rightName = right;
    } else if (constantRegex.test(right)) {
      rightType = "constant";
    }
    // New branch: If right side contains arithmetic operators (e.g. a*c+d/arr[2])
    else if (/[+\-*/]/.test(right)) {
      // Parse the right-hand side expression.
      // This regex will match tokens which can be variables, array accesses (e.g. arr[2]),
      // or constants (digits or single/double quoted characters).
      const tokenRegex = /([a-zA-Z_$][0-9a-zA-Z_$]*(?:\[\d+\])?|\d+|'[^']'|"[^"]")/g;
      const tokens = right.match(tokenRegex);
      // Find all operators in order.
      const operatorRegex = /[+\-*/]/g;
      const operators = right.match(operatorRegex) || [];

      // For each token, if it is a variable or array, get its index.
      // Otherwise, leave it as the constant string.
      const operandIndices = tokens.map((token) => {
        if (arrayRegex.test(token)) {
          const match = token.match(arrayRegex);
          const arrName = match[1];
          return findIndexByValue("array_name", arrName);
        } else if (varRegex.test(token)) {
          return findIndexByValue("varName", token);
        } else {
          return token; // For constants, you might want to convert it (e.g., Number(token))
        }
      });

      // Determine the left-hand target index and also the left array index if applicable.
      let targetIndex;
      let leftArrayArg;
      if (leftType === "array") {
        targetIndex = findIndexByValue("array_name", leftName);
        leftArrayArg = leftIndex; // pass the index from arr[...] (e.g., "3")
      } else if (leftType === "variable") {
        targetIndex = findIndexByValue("varName", leftName);
        leftArrayArg = "no";
      }

      console.log(targetIndex, operandIndices, operators, leftArrayArg);
      
      handleArithmeticExpression(targetIndex, operandIndices, operators, leftArrayArg);
      msec = varsec;
      return;
    } else {
      console.error("Right-hand token not recognized: " + right);
      return;
    }

    // Dispatch based on token types for the simple cases.
    if (leftType === "variable" && rightType === "variable") {
      const leftIdx = findIndexByValue("varName", leftName);
      const rightIdx = findIndexByValue("varName", rightName);
      handleMove(rightIdx, leftIdx);
      msec = varsec;
    } else if (leftType === "variable" && rightType === "constant") {
      const leftIdx = findIndexByValue("varName", leftName);
      move_Constant_to_variable(leftIdx, right);
      msec = varsec;
    } else if (leftType === "array" && rightType === "constant") {
      const arrIdx = findIndexByValue("array_name", leftName);
      handle_constant_to_array_move(arrIdx, right, leftIndex);
      msec = arraysec;
    } else if (leftType === "array" && rightType === "array") {
      const leftArrIdx = findIndexByValue("array_name", leftName);
      const rightArrIdx = findIndexByValue("array_name", rightName);
      handleArrayMove(leftArrIdx, rightArrIdx, leftIndex, rightIndex);
      msec = arraysec;
    } else if (leftType === "array" && rightType === "variable") {
      const arrIdx = findIndexByValue("array_name", leftName);
      const varIdx = findIndexByValue("varName", rightName);
      handle_Variable_to_array(varIdx, arrIdx, leftIndex);
      msec = arraysec;
    } else if (leftType === "variable" && rightType === "array") {
      const varIdx = findIndexByValue("varName", leftName);
      const arrIdx = findIndexByValue("array_name", rightName);
      handle_Array_to_variable(arrIdx, varIdx, rightIndex);
      msec = arraysec;
    } else {
      console.error("Unhandled expression format: " + expression);
    }
  };

  // Expose a method to run an array of expressions sequentially.
  const runExpressions = async (exprArray) => {
    for (const expr of exprArray) {
      console.log("Executing:", expr);
      executeExpression(expr);
      // Adjust the delay as needed.
      console.log(msec);
      await delay(msec);
    }
  };

  const expression_Array = [
    "int a = 3",
    "int b = 4",
    "int c = 0",
    "int d = 2",
    "int arr[4]=[1,2,3,4]",
    "arr[3]=a*c+d/arr[2]",
  ];
  const handleStepOver = () => {
    if (currentIndex < expression_array.length) {
      executeExpression(expression_array[currentIndex]);
      setCurrentIndex(currentIndex + 1);
    }
  };
  // Use useImperativeHandle to expose runExpressions to parent components.
  useImperativeHandle(ref, () => ({
    runExpressions,
  }));

  return (
    <div className="box">
      <div className="scrollable-div">
        <svg ref={svgRef} width={window.innerWidth / 2 - 15} height={1000}></svg>
      </div>
      <div className="controls flex items-center gap-5 justify-center mt-4">
  <button 
    onClick={() => {}} 
    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 shadow-lg transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    ⬅️
  </button>

  <button
    onClick={() => runExpressions(expression_array)}
    className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    <span className="text-2xl">▶️</span>
  </button>

  <button 
    onClick={() => {}} 
    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 shadow-lg transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    &#10074;&#10074;
  </button>

  <button 
    onClick={() => {handleStepOver}} 
    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 shadow-lg transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    ➡️
  </button>
</div>

    </div>
  );
});

export default Visualizer;
