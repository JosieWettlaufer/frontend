/**
 * @file UnitConverterCard.js
 * @description Card component for displaying and managing a single unit conversion.
 */

import React from "react";
import { conversions } from "./conversion";

/**
 * UnitConverterCard Component
 * @param {Object} props - Component properties.
 * @param {Object} props.converter - The converter object containing unit conversion details.
 * @param {string} props.converter.id - Unique identifier for the converter.
 * @param {string} props.converter.category - Conversion category (e.g., "Fahrenheit").
 * @param {string} props.converter.inputValue1 - Input value for the first unit.
 * @param {string} props.converter.inputValue2 - Input value for the second unit.
 * @param {boolean} props.converter.isLocal - Whether the converter is local (unsaved) or stored in the database.
 * @param {string} [props.converter.fromUnit] - The 'from' unit for a saved conversion.
 * @param {string} [props.converter.toUnit] - The 'to' unit for a saved conversion.
 * @param {string} [props.converter.customLabel] - Custom label for saved conversions.
 * @param {Function} props.onCategoryChange - Function to handle category selection changes.
 * @param {Function} props.onInput1Change - Function to handle changes in the first input field.
 * @param {Function} props.onInput2Change - Function to handle changes in the second input field.
 * @param {Function} props.onSave - Function to handle saving a local converter.
 * @param {Function} props.onDelete - Function to handle deleting a converter.
 * @param {boolean} props.isDisabled - Whether the delete button should be disabled.
 * @returns {JSX.Element} - The rendered unit converter card component.
 */
const UnitConverterCard = ({
  converter,
  onCategoryChange,
  onInput1Change,
  onInput2Change,
  onSave,
  onDelete,
  isDisabled,
}) => {
  // Determine unit labels based on whether the converter is local or saved
  const unit1 = converter.isLocal ? conversions[converter.category].unit1 : converter.fromUnit;
  const unit2 = converter.isLocal ? conversions[converter.category].unit2 : converter.toUnit;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          {converter.isLocal ? (
            <select
              value={converter.category}
              onChange={(e) => onCategoryChange(converter.id, e.target.value)}
              className="form-select me-2"
              style={{ maxWidth: "200px" }}
            >
              <option value="mL">Cups to mL</option>
              <option value="Fahrenheit">Celsius to Fahrenheit</option>
              <option value="grams">Ounces to Grams</option>
              <option value="pounds">Kilograms to Pounds</option>
              <option value="tbsp">Tablespoons to mL</option>
              <option value="tsp">Teaspoons to mL</option>
            </select>
          ) : (
            <h5 className="card-title mb-0 me-auto">{converter.customLabel}</h5>
          )}

          <div className="ms-auto">
            {converter.isLocal && (
              <button className="btn btn-primary me-2" onClick={() => onSave(converter.id)}>
                Save
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => onDelete(converter.id)}
              disabled={isDisabled}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <div className="input-group me-3">
            <input
              type="number"
              placeholder="Enter value"
              value={converter.inputValue1}
              onChange={(e) => onInput1Change(converter.id, e.target.value)}
              className="form-control"
            />
            <span className="input-group-text">{unit1}</span>
          </div>

          <div className="equals text-center mx-2">=</div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Enter value"
              value={converter.inputValue2}
              onChange={(e) => onInput2Change(converter.id, e.target.value)}
              className="form-control"
            />
            <span className="input-group-text">{unit2}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverterCard;
