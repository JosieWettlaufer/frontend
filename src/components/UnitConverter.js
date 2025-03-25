import { useState } from "react";

const UnitConverter = () => {
  // Track multiple converters in an array
  const [converters, setConverters] = useState([
    { id: 1, category: "Fahrenheit", inputValue1: "", inputValue2: "" }
  ]);

  const conversions = {
    mL: { 
      label: "Cups to Milliliters", 
      formula: (cups) => cups * 236.588, 
      reverseFormula: (ml) => ml / 236.588,
      unit1: "Cups",
      unit2: "mL" 
    },
    Fahrenheit: { 
      label: "Celsius to Fahrenheit", 
      formula: (c) => (c * 9) / 5 + 32, 
      reverseFormula: (f) => ((f - 32) * 5) / 9,
      unit1: "Celsius",
      unit2: "Fahrenheit"
    },
  };

  // Handle change in the first input field
  const handleInput1Change = (id, value) => {
    if (value === "" || isNaN(value)) {
      updateConverter(id, { inputValue1: value, inputValue2: "" });
      return;
    }

    const numValue = parseFloat(value);
    const converter = converters.find(c => c.id === id);
    const conversion = conversions[converter.category];
    
    // Calculate value for second input
    const calculatedValue = conversion.formula(numValue).toFixed(2);
    
    updateConverter(id, { inputValue1: value, inputValue2: calculatedValue });
  };

  // Handle change in the second input field
  const handleInput2Change = (id, value) => {
    if (value === "" || isNaN(value)) {
      updateConverter(id, { inputValue2: value, inputValue1: "" });
      return;
    }

    const numValue = parseFloat(value);
    const converter = converters.find(c => c.id === id);
    const conversion = conversions[converter.category];
    
    // Calculate value for first input
    const calculatedValue = conversion.reverseFormula(numValue).toFixed(2);
    
    updateConverter(id, { inputValue2: value, inputValue1: calculatedValue });
  };

  const updateConverter = (id, updates) => {
    setConverters(converters.map(converter => 
      converter.id === id ? { ...converter, ...updates } : converter
    ));
  };

  const handleCategoryChange = (id, category) => {
    const converter = converters.find(c => c.id === id);
    updateConverter(id, { category });
    
    // Recalculate if there's an input value
    if (converter.inputValue1) {
      handleInput1Change(id, converter.inputValue1);
    }
  };

  const addConverter = () => {
    // Create a new converter with a unique ID
    const newId = Math.max(...converters.map(c => c.id), 0) + 1;
    setConverters([
      ...converters,
      { id: newId, category: "Fahrenheit", inputValue1: "", inputValue2: "" }
    ]);
  };

  const removeConverter = (id) => {
    // Remove converter but ensure at least one remains
    if (converters.length > 1) {
      setConverters(converters.filter(converter => converter.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="d-flex justify-content-between">
        Unit Converter
        <button 
          className="btn btn-success"
          onClick={addConverter}>
          Add Unit Converter
        </button>
      </h2>

      {converters.map((converter) => {
        const conversion = conversions[converter.category];
        
        return (
          <div key={converter.id} className="d-flex align-items-center mb-3">
            {/* First input field */}
            <input 
              type="number"
              placeholder="Enter value"
              value={converter.inputValue1}
              onChange={(e) => {
                handleInput1Change(converter.id, e.target.value);
              }}
              className="form-control me-2"
            />

            <span className="me-2">{conversion.unit1}</span>

            <select
              value={converter.category}
              onChange={(e) => handleCategoryChange(converter.id, e.target.value)}
              className="form-select me-2"
            >
              <option value="mL">Cups/mL</option>
              <option value="Fahrenheit">Celsius/Fahrenheit</option>
            </select>

            {/* Second input field */}
            <input 
              type="number"
              placeholder="Enter value"
              value={converter.inputValue2}
              onChange={(e) => {
                handleInput2Change(converter.id, e.target.value);
              }}
              className="form-control me-2"
            />

            <span className="me-2">{conversion.unit2}</span>

            <button 
              className="btn btn-danger"
              onClick={() => removeConverter(converter.id)}
              disabled={converters.length === 1}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default UnitConverter;