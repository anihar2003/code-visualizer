import createVariable from "./elements/Create-variable";
import { moveVariableToVariable } from "./movement/Variable_to_Variable";
import createArray from "./elements/Create-array";
import { moveArrayElement } from "./movement/Array_to_Array";
import { moveConstant_to_array } from "./movement/Constant_to_Array";
import { moveConstant_to_variable } from "./movement/Constant_to_Variable";
import { Array_to_variable } from "./movement/Array_to_Variable";
import { Variable_to_array } from "./movement/Variable_to_Array";
import { expression_animator } from "./movement/expression_animator";

export const useVariables = () => {
  let elements = [];
  let variables = 0;
  let arrays = 0;

  const y_clac = (y_value, last_elm_type) => {
    if (last_elm_type === "variable") {
      return y_value + 0;
    } else {
      return y_value + 20;
    }
  }

  const addVariable = (svgRef, var_name, var_value, var_type) => {
    variables++;
    let y_value = elements.length > 0 ? elements[elements.length - 1].y + 70 : 40;
    y_value = y_clac(y_value, elements.length > 0 ? elements[elements.length - 1].type : "variable");

    const newVar = {
      id: `var_${elements.length + 1}`,
      type: "variable",
      varName: var_name,
      varType: var_type,
      varValue: var_value,
      x: 0,
      y: y_value,
      ref: { current: null },
    };
    elements.push(newVar); // Using push() to add new variable

    if (svgRef.current) {
      const newVarElement = createVariable(
        newVar.varName,
        newVar.varType,
        newVar.varValue,
        newVar.x,
        newVar.y
      );
      newVar.ref.current = newVarElement;
      svgRef.current.appendChild(newVarElement);
    }
  };

  const addArray = (svgRef, array_name, arr, array_type) => {
    arrays++;
    let y_value_array = elements.length > 0 ? elements[elements.length - 1].y + 70 : 40;
    y_value_array = y_clac(y_value_array, elements.length > 0 ? elements[elements.length - 1].type : "variable");
    const arrayCount = elements.filter(e => e.type === "array").length;
    const y_value = elements.length > 0 ? elements[elements.length - 1].y + 90 : 40;
    const newArray = {
      id: `arr_${elements.length + 1}`,
      type: "array",
      array_name: array_name,
      array_ref: { current: null },
      x: 0,
      y: y_value_array,
      array_length: arr.length,
      array_type: array_type,
      actual_array: arr,
    };

    elements.push(newArray); // Using push() to add new array

    if (svgRef.current) {
      const newArrayElement = createArray(
        newArray.array_name,
        newArray.array_type,
        newArray.x,
        newArray.y,
        newArray.array_length,
        newArray.actual_array
      );
      newArray.array_ref.current = newArrayElement;
      svgRef.current.appendChild(newArrayElement);
    }
  };

  const handleMove = (index1, index2) => {
    if (variables >= 2) {
      const var1 = elements[index1];
      const var2 = elements[index2];
      moveVariableToVariable(var1, var2);

      setTimeout(() => {
        elements.forEach((element, i) => {
          if (element.id === var2.id) {
            element.varValue = var1.varValue; // Directly modify element's varValue
          }
        });
      }, 1000);
    }
  };

  const handleArrayMove = (sourceIndex, destIndex, sourceArrayIndex, destArrayIndex) => {
    if (arrays >= 2) {
      const sourceArray = elements[sourceIndex];
      const destArray = elements[destIndex];
      moveArrayElement(sourceArray, destArray, sourceArrayIndex, destArrayIndex);

      setTimeout(() => {
        elements.forEach((element) => {
          if (element.id === destArray.id) {
            const newActualArray = [...element.actual_array];
            newActualArray[destArrayIndex] = sourceArray.actual_array[sourceArrayIndex];
            element.actual_array = newActualArray; // Directly modify element's actual_array
          }
        });
      }, 1000);
    }
  };

  const handle_constant_to_array_move = (array, constant, array_index) => {
    const sourceArray = elements[array];
    moveConstant_to_array(sourceArray, constant, array_index);
    setTimeout(() => {
      elements.forEach((element) => {
        if (element.id === sourceArray.id) {
          const newActualArray = [...element.actual_array];
          newActualArray[array_index] = constant;
          element.actual_array = newActualArray; // Directly modify element's actual_array
        }
      });
    }, 1000);
  };

  const move_Constant_to_variable = (var_to, constant) => {
    const var1 = elements[var_to];
    moveConstant_to_variable(var1, constant);
    setTimeout(() => {
      elements.forEach((element) => {
        if (element.id === var1.id) {
          element.varValue = constant; // Directly modify element's varValue
        }
      });
    }, 1000);
  };

  const handle_Array_to_variable = (array1, var1, array1index) => {
    const array1_atov = elements[array1];
    const var1_atov = elements[var1];
    Array_to_variable(array1_atov, var1_atov, array1index);
    setTimeout(() => {
      elements.forEach((element) => {
        if (element.id === var1.id) {
          element.varValue = array1_atov.actual_array[array1index]; // Directly modify element's varValue
        }
      });
    }, 1000);
  };

  const handle_Variable_to_array = (var1, array1, array1Index) => {
    const var_vtoa = elements[var1];
    const array_vtoa = elements[array1];
    Variable_to_array(var_vtoa, array_vtoa, array1Index);
    setTimeout(() => {
      elements.forEach((element) => {
        if (element.id === array1.id) {
          element.actual_array = var_vtoa.varValue; // Directly modify element's actual_array
        }
      });
    }, 1000);
  };

  const handleArithmeticExpression = (targetIndex, operandIndices, operators, leftArrayArg) => {
    let type = elements[targetIndex].type;
    let left_side = elements[targetIndex];
    let right_side = operandIndices.map((e) => elements[e]);
    let result = right_side[0].type === "array" ? right_side[0].array_value : right_side[0].value;
  
      operators.forEach((operator, index) => {
        let nextValue = right_side[index + 1].type === "array" ? right_side[index + 1].array_value : right_side[index + 1].value;
  
        switch (operator) {
          case "+": result += nextValue; break;
          case "-": result -= nextValue; break;
          case "*": result *= nextValue; break;
          case "/": result /= nextValue; break;
          default: console.error("Unknown operator: " + operator);
        }
      });
      console.log(result);
    if(type==="array"){
      moveConstant_to_array(left_side, result, leftArrayArg);
    }else if (type==="variable") {
      moveConstant_to_variable(left_side, result);
    }
  
    //expression_animator(type, left_side,left_index,right_side, operators);
  
    setTimeout(() => {
      if (type === "array") {
        elements[targetIndex].array_value=result;
      } else if (type === "variable") {
        elements[targetIndex].value = result;
      }
    }, 1000);
  };
  

  return {
    variables,
    arrays,
    elements,
    addVariable,
    handleMove,
    addArray,
    handleArrayMove,
    handle_constant_to_array_move,
    move_Constant_to_variable,
    handle_Array_to_variable,
    handle_Variable_to_array,
    handleArithmeticExpression,
  };
};
