import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { sortByValues, sortByLabels } from "./../config/env";
import { CHANGE_SORT_TYPE } from "./../store/reducers/filters.js";

export const SortByComponent = ({ filters, setSortType }) => {
  const [opened, setOpened] = useState(false);
  const ref = useRef(null);
  const focusTargetRef = useRef(null);
  const { sortBy } = filters;

  useEffect(() => {
    if (focusTargetRef) {
      $(focusTargetRef.current).on("focusout", () => {
        setTimeout(() => setOpened(false), 100);
      });
    }
    return () => {};
  }, []);

  const toggle = e => {
    const newOpenedStatus = !opened;

    if (newOpenedStatus) {
      jQuery(focusTargetRef.current).focus();
    }

    setOpened(newOpenedStatus);
  };

  const select = key => {
    setOpened(false);
    setSortType(key);
  };

  return (
    <div className="bw-sort-by">
      <span>{window._translationDictionary.get("Сортировать по")}:</span>
      <div className={opened ? "opened" : ""}>
        <input
          type="tel"
          ref={focusTargetRef}
          style={{
            width: 0,
            height: 0,
            opacity: 0
          }}
        />
        <span
          className="bw-sort-by-current"
          onClick={e => toggle(e)}
          ref={ref}
          onBlur={e => toggle()}
        >
          {sortByLabels[sortBy]}
        </span>
        <ul className={`bw-sort-by-list`}>
          {Object.keys(sortByValues).map((key, index) => (
            <li key={index} onClick={_ => select(key)}>
              {sortByLabels[key]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default connect(
  state => ({
    filters: state.filters
  }),
  dispatch => ({
    setSortType: payload => dispatch({ type: CHANGE_SORT_TYPE, payload })
  })
)(SortByComponent);
