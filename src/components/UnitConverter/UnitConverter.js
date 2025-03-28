/**
 * @file UnitConverter.js
 * @description React component for handling unit conversions with preset and custom conversion options.
 */

import { useState, useEffect } from "react";
import { conversions } from "./conversion";
import { fetchConverters, saveConverter, deleteConverter } from "./api";
import UnitConverterCard from "./UnitConverterCard";

/**
 * UnitConverter Component
 * @param {Object} props - Component properties.
 * @param {string} props.pageId - The ID of the page to fetch and store unit converters.
 * @returns {JSX.Element} - The unit converter component.
 */
const UnitConverter = ({ pageId }) => {
  /**
   * @typedef {Object} Converter
   * @property {string} id - Unique identifier for the converter.
   * @property {string} category - Conversion category (e.g., "Fahrenheit").
   * @property {string} inputValue1 - Input value for the first unit.
   * @property {string} inputValue2 - Input value for the second unit.
   * @property {boolean} isLocal - Whether the converter is local (unsaved) or stored in the database.
   */

  // State to manage unit converters
  const [converters, setConverters] = useState([
    {
      id: "local-1",
      category: "Fahrenheit",
      inputValue1: "",
      inputValue2: "",
      isLocal: true,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved unit converters from the backend on component mount
  useEffect(() => {
    const loadConverters = async () => {
      try {
        setLoading(true);
        const data = await fetchConverters(pageId);

        // Transform database converters into the expected UI format
        const savedConverters = data.unitConverters.map((converter) => ({
          id: converter._id,
          category: converter.category,
          fromUnit: converter.fromUnit,
          toUnit: converter.toUnit,
          conversionFactor: converter.conversionFactor,
          inputValue1: "",
          inputValue2: "",
          isLocal: false,
          customLabel: `${converter.fromUnit} to ${converter.toUnit}`,
        }));

        // Ensure at least one converter is present
        setConverters(
          savedConverters.length > 0
            ? savedConverters
            : [
                {
                  id: "local-1",
                  category: "Fahrenheit",
                  inputValue1: "",
                  inputValue2: "",
                  isLocal: true,
                },
              ]
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching unit converters:", error);
        setError("Failed to load unit converters");
        setLoading(false);
      }
    };

    if (pageId) {
      loadConverters();
    }
  }, [pageId]);

  /**
   * Updates the state for a specific converter.
   * @param {string} id - Converter ID.
   * @param {Object} updates - Properties to update.
   */
  const updateConverter = (id, updates) => {
    setConverters((prevConverters) =>
      prevConverters.map((converter) =>
        converter.id === id ? { ...converter, ...updates } : converter
      )
    );
  };

  /**
   * Handles changes in the first input field and updates the second field accordingly.
   * @param {string} id - Converter ID.
   * @param {string} value - New value for the first input field.
   */
  const handleInput1Change = (id, value) => {
    if (value === "" || isNaN(value)) {
      updateConverter(id, { inputValue1: value, inputValue2: "" });
      return;
    }

    const numValue = parseFloat(value);
    const converter = converters.find((c) => c.id === id);

    let calculatedValue = converter.isLocal
      ? conversions[converter.category].formula(numValue).toFixed(2)
      : (numValue * converter.conversionFactor).toFixed(2);

    updateConverter(id, { inputValue1: value, inputValue2: calculatedValue });
  };

  /**
   * Handles changes in the second input field and updates the first field accordingly.
   * @param {string} id - Converter ID.
   * @param {string} value - New value for the second input field.
   */
  const handleInput2Change = (id, value) => {
    if (value === "" || isNaN(value)) {
      updateConverter(id, { inputValue2: value, inputValue1: "" });
      return;
    }

    const numValue = parseFloat(value);
    const converter = converters.find((c) => c.id === id);

    let calculatedValue = converter.isLocal
      ? conversions[converter.category].reverseFormula(numValue).toFixed(2)
      : (numValue / converter.conversionFactor).toFixed(2);

    updateConverter(id, { inputValue2: value, inputValue1: calculatedValue });
  };

  /**
   * Handles category change and recalculates conversion if needed.
   * @param {string} id - Converter ID.
   * @param {string} category - New category for the converter.
   */
  const handleCategoryChange = (id, category) => {
    updateConverter(id, { category });

    const converter = converters.find((c) => c.id === id);
    if (converter.inputValue1) {
      handleInput1Change(id, converter.inputValue1);
    }
  };

  /**
   * Adds a new local converter.
   */
  const addConverter = () => {
    setConverters([
      ...converters,
      {
        id: `local-${Date.now()}`,
        category: "Fahrenheit",
        inputValue1: "",
        inputValue2: "",
        isLocal: true,
      },
    ]);
  };

  /**
   * Removes a converter from the list, ensuring at least one remains.
   * @param {string} id - Converter ID.
   */
  const removeConverter = (id) => {
    if (converters.length > 1) {
      setConverters(converters.filter((converter) => converter.id !== id));
    }
  };

  /**
   * Saves a local converter to the backend.
   * @param {string} id - Converter ID.
   */
  const handleSaveConverter = async (id) => {
    try {
      const converter = converters.find((c) => c.id === id);
      if (!converter.isLocal) return;

      const conversion = conversions[converter.category];

      const converterData = {
        pageId,
        category: converter.category,
        fromUnit: conversion.unit1,
        toUnit: conversion.unit2,
        conversionFactor: conversion.conversionFactor,
      };

      const data = await saveConverter(pageId, converterData);
      const savedConverter = data.unitConverters[data.unitConverters.length - 1];

      updateConverter(id, {
        id: savedConverter._id,
        isLocal: false,
        fromUnit: savedConverter.fromUnit,
        toUnit: savedConverter.toUnit,
        conversionFactor: savedConverter.conversionFactor,
        customLabel: `${savedConverter.fromUnit} to ${savedConverter.toUnit}`,
      });
    } catch (error) {
      console.error("Error saving unit converter:", error);
      setError("Failed to save unit converter");
    }
  };

  /**
   * Deletes a converter from the backend.
   * @param {string} id - Converter ID.
   */
  const handleDeleteConverter = async (id) => {
    const converter = converters.find((c) => c.id === id);

    if (converter.isLocal) {
      removeConverter(id);
      return;
    }

    try {
      await deleteConverter(pageId, id);
      removeConverter(id);
    } catch (error) {
      console.error("Error deleting unit converter:", error);
      setError("Failed to delete unit converter");
    }
  };

  if (loading) return <div className="text-center my-4">Loading unit converters...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="d-flex justify-content-between align-items-center mb-4">
        Unit Converter
        <button className="btn btn-success" onClick={addConverter}>Add Unit Converter</button>
      </h2>

      {converters.map((converter) => (
        <UnitConverterCard
          key={converter.id}
          converter={converter}
          onCategoryChange={handleCategoryChange}
          onInput1Change={handleInput1Change}
          onInput2Change={handleInput2Change}
          onSave={handleSaveConverter}
          onDelete={handleDeleteConverter}
          isDisabled={converters.length === 1}
        />
      ))}
    </div>
  );
};

export default UnitConverter;
