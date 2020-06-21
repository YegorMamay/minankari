import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  FETCH_FILTERS_COMPLETED,
  FETCH_FILTERS_START,
  FETCH_FILTERS_ERROR,
  CHANGE_IN_STOCK_STATUS,
  CHANGE_PRE_ORDER_STATUS,
  CHANGE_PRICE,
  SET_ACTIVATED_FILTERS,
} from "./../store/reducers/filters";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import { config } from "./../config/env";

export const calculatePriceValue = (currentPercent, maxValue) =>
  Math.floor((maxValue * currentPercent) / 100);

export const checkIsActive = (value, slug, activated) => {
  return slug in activated && activated[slug].indexOf(value) !== -1;
};

export const FiltersGroupComponent = ({ title, children }) => {
  const content = useRef(null);

  const slideContent = (e) => {
    jQuery(content).slideToggle(300);
  };

  return (
    <div className="bw-filters-group-container">
      <div className="bw-filters-group-header" onClick={(e) => slideContent(e)}>
        {title}
      </div>
      <div className="bw-filters-group-content" ref={content}>
        {children}
      </div>
    </div>
  );
};

export const FiltersCheckboxComponent = ({
  checked,
  value,
  label,
  onChange,
  type,
  extra,
}) => (
  <label className="bw-pf-checkbox">
    <span
      className={[
        type === "default" ? "square" : "square color",
        checked ? "checked" : "",
      ].join(" ")}
      style={{ backgroundColor: type === "color" ? extra : "transparent" }}
    ></span>
    <input
      type="checkbox"
      checked={checked || false}
      value={value}
      onChange={(evt) => onChange(evt.target.checked, value)}
    />
    <span className="label">{label || value}</span>
  </label>
);


export const FiltersPriceComponent = ({ value, defaultValue, onChange }) => {
  const min = defaultValue[0],
    max = defaultValue[1];

  const minRef = useRef(),
    maxRef = useRef();

  const [localState, setLocalState] = useState([min, max]);

  useEffect(() => {
    minRef.current.value = localState[0];
    maxRef.current.value = localState[1];
  }, [localState]);

  const changeHandler = (value) => {
    if (onChange) onChange(value);
  };

  const inputChangeHandler = (value, inputType) => {
    const validValue = value < min ? min : value > max ? max : value;

    const values = [...localState];

    switch (inputType) {
      case "min": {
        values[0] = Math.min(validValue, values[1]);
        break;
      }
      case "max": {
        values[1] = Math.max(validValue, values[0]);
        break;
      }
    }

    setLocalState(values);
    changeHandler(values);
  };

  return (
    <FiltersGroupComponent title={window._translationDictionary.get("Цена:")}>
      <div className="bw-price-inputs">
        <label>
          <span>{window._translationDictionary.get("от")}</span>
          <input
            type="tel"
            defaultValue={localState[0]}
            onBlur={(event) => inputChangeHandler(event.target.value, "min")}
            ref={minRef}
          />
        </label>
        <label>
          <span>{window._translationDictionary.get("до")}</span>
          <input
            type="tel"
            defaultValue={localState[1]}
            onBlur={(event) => inputChangeHandler(event.target.value, "max")}
            ref={maxRef}
          />
        </label>
      </div>
      <Slider.Range
        allowCross={false}
        value={localState}
        onChange={(value) => setLocalState(value)}
        onAfterChange={(value) => changeHandler(value)}
        min={min}
        max={max}
      />
    </FiltersGroupComponent>
  );
};


export class FiltersComponent extends React.Component {
  componentDidMount() {
    this.loadFilters();
  }

  loadFilters() {
    this.props.fetchStart();
    fetch(this.queryBuilder())
      .then((response) => response.json())
      .then((data) => {
        this.props.fetchCompleted(data);
      })
      .catch((error) => this.props.fetchError(error));
  }

  queryBuilder() {
    let params = [];
    let url = "/wp-json/brainworks/filters";

    if (config.Category) params.push(`category=${config.Category}`);
    if (config.OnSale) params.push(`on_sale=true`);
    if (params.length > 0) url += "?" + params.join("&");

    return url;
  }

  changeInStockStatus(status) {
    this.props.changeInStockStatus(status);
  }

  changePreOrderStatus(status) {
    this.props.changePreOrderStatus(status);
  }

  changePrice(price) {
    this.props.changePrice(price);
  }

  changeActivatedFilters(slug, value) {
    this.props.changeActivatedFilters([slug, value]);
  }

  render() {
    const {
      price,
      defaultPrice,
      filters,
      activatedFilters,
    } = this.props.filters;

    return (
      <div>
        <h4 className="bw-filters-header">{window._translationDictionary.get("Параметры")}</h4>

        {!!defaultPrice[0] && !!defaultPrice[1] ? (
          <FiltersPriceComponent
            defaultValue={defaultPrice}
            value={price}
            onChange={this.changePrice.bind(this)}
          />
        ) : null}
        {filters.map((filter, key) => {
          return (
            <FiltersGroupComponent key={key} title={filter.Name}>
              {filter.Options.map((option, index) => {
                return (
                  <FiltersCheckboxComponent
                    key={index}
                    value={option}
                    label={option}
                    checked={checkIsActive(
                      option,
                      filter.Slug,
                      activatedFilters
                    )}
                    type={filter.Type}
                    extra={filter.Descriptions[index]}
                    onChange={(_, value) =>
                      this.changeActivatedFilters(filter.Slug, value)
                    }
                  />
                );
              })}
            </FiltersGroupComponent>
          );
        })}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    filters: state.filters,
  }),
  (dispatch) => ({
    fetchStart: () => dispatch({ type: FETCH_FILTERS_START }),
    fetchCompleted: (payload) =>
      dispatch({ type: FETCH_FILTERS_COMPLETED, payload }),
    fetchError: (error) =>
      dispatch({ type: FETCH_FILTERS_ERROR, payload: error }),
    changeInStockStatus: (payload) =>
      dispatch({ type: CHANGE_IN_STOCK_STATUS, payload }),
    changePreOrderStatus: (payload) =>
      dispatch({ type: CHANGE_PRE_ORDER_STATUS, payload }),
    changePrice: (payload) => dispatch({ type: CHANGE_PRICE, payload }),
    changeActivatedFilters: (payload) =>
      dispatch({ type: SET_ACTIVATED_FILTERS, payload }),
  })
)(FiltersComponent);
