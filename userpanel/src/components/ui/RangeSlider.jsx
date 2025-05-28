"use client";

import { memo } from "react";
import ReactSlider from "react-slider";
const Thumb = (props, state) => (
  <div
    {...props}
    key={state.index}
    className={
      "h-4 w-4 bg-white border-4 border-primary rounded-full cursor-pointer shadow-sm -mt-1.5"
    }
  ></div>
);

const Track = (props, state) => (
  <div
    {...props}
    key={state.index}
    className={`absolute top-0 bottom-0 rounded-md  ${
      [1].includes(state.index) ? "bg-gray-200" : "bg-primary"
    }`}
  />
);

const RangeSlider = memo(
  ({
    defaultValue,
    min,
    max,
    rangeValue,
    setRangeValue,
    setInputValues,
    className = "",
    step = 0.01,
    renderThumb = Thumb,
    renderTrack = Track,
    children = "",
  }) => {
    return (
      <>
        <ReactSlider
          className={`w-full h-1 relative ${className}`}
          defaultValue={defaultValue}
          value={rangeValue}
          min={min}
          max={max}
          step={step}
          renderThumb={renderThumb}
          renderTrack={renderTrack}
          onChange={(value) => {
            setInputValues(value);
          }}
          onAfterChange={(value) => {
            setRangeValue(value);
          }}
        />
        {children}
      </>
    );
  }
);

export default RangeSlider;
