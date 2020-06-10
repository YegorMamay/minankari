import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import {
  FETCH_FILTERS_COMPLETED,
  FETCH_FILTERS_START,
  FETCH_FILTERS_ERROR,
  CHANGE_IN_STOCK_STATUS,
  CHANGE_PRE_ORDER_STATUS,
  CHANGE_PRICE,
  SET_ACTIVATED_FILTERS
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

  const slideContent = e => {
    jQuery(content).slideToggle(300);
  };

  return (
    <div className="bw-filters-group-container">
      <div className="bw-filters-group-header" onClick={e => slideContent(e)}>
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
  extra
}) => (
  <label className="bw-pf-checkbox">
    <span
      className={[
        type === "default" ? "square" : "square color",
        checked ? "checked" : ""
      ].join(" ")}
      style={{ backgroundColor: type === "color" ? extra : "transparent" }}
    ></span>
    <input
      type="checkbox"
      checked={checked || false}
      value={value}
      onChange={evt => onChange(evt.target.checked, value)}
    />
    <span className="label">{label || value}</span>
  </label>
);

export const FiltersStockStatusComponent = ({
  isInStock,
  isPreOrderAllowed,
  inStockStatusChange,
  preOrderStatusChange
}) => {
  const inStockChanged = ([checked, value]) => {
    inStockStatusChange(checked);
  };

  const preOrderChanged = ([checked, value]) => {
    preOrderStatusChange(checked);
  };

  return (
    <FiltersGroupComponent title={"Наличие"}>
      <FiltersCheckboxComponent
        checked={isInStock}
        value={"inStock"}
        label={"На складе"}
        type={"default"}
        onChange={(...data) => inStockChanged(data)}
      />
      <FiltersCheckboxComponent
        checked={isPreOrderAllowed}
        value={"preOrder"}
        label={"Предзаказ"}
        type={"default"}
        onChange={(...data) => preOrderChanged(data)}
      />
    </FiltersGroupComponent>
  );
};

export const FiltersPriceComponent = ({ value, defaultValue, onChange }) => {
  const min = defaultValue[0],
    max = defaultValue[1];
  const [localState, setLocalState] = useState([min, max]);
  const afterChange = value => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FiltersGroupComponent title={"Цена:"}>
      <div className="bw-price-inputs">
        <label>
          <span>от</span>
          <input type="number" value={localState[0]} />
        </label>
        <label>
          <span>до</span>
          <input type="number" value={localState[1]} />
        </label>
      </div>
      <Slider.Range
        allowCross={false}
        value={localState}
        onChange={value => setLocalState(value)}
        onAfterChange={value => afterChange(value)}
        min={min}
        max={max}
      />
    </FiltersGroupComponent>
  );
};

export const FiltersActivatedPropertiesComponent = ({
  data,
  onDeactivateFilter
}) => {
  return (
    <div className="bw-pf-activated-filters">
      {Object.keys(data).map((key, index) =>
        data[key].map((property, index) => {
          return (
            <span onClick={_ => onDeactivateFilter(key, property)} key={index}>
              {property}
            </span>
          );
        })
      )}
    </div>
  );
};

export class FiltersComponent extends React.Component {
  componentDidMount() {
    this.loadFilters();
  }

  loadFilters() {
    this.props.fetchStart();
    fetch(this.queryBuilder())
      .then(response => response.json())
      .then(data => {
        this.props.fetchCompleted(data);
      })
      .catch(error => this.props.fetchError(error));
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
      inStock,
      preOrder,
      price,
      defaultPrice,
      filters,
      activatedFilters
    } = this.props.filters;

    return (
      <div>
        <h4 className="bw-filters-header">Параметры</h4>
        {/* <FiltersActivatedPropertiesComponent
          data={activatedFilters}
          onDeactivateFilter={this.changeActivatedFilters.bind(this)}
        /> */}
        <FiltersStockStatusComponent
          isInStock={inStock}
          isPreOrderAllowed={preOrder}
          inStockStatusChange={this.changeInStockStatus.bind(this)}
          preOrderStatusChange={this.changePreOrderStatus.bind(this)}
        />
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
  state => ({
    filters: state.filters
  }),
  dispatch => ({
    fetchStart: () => dispatch({ type: FETCH_FILTERS_START }),
    fetchCompleted: payload =>
      dispatch({ type: FETCH_FILTERS_COMPLETED, payload }),
    fetchError: error =>
      dispatch({ type: FETCH_FILTERS_ERROR, payload: error }),
    changeInStockStatus: payload =>
      dispatch({ type: CHANGE_IN_STOCK_STATUS, payload }),
    changePreOrderStatus: payload =>
      dispatch({ type: CHANGE_PRE_ORDER_STATUS, payload }),
    changePrice: payload => dispatch({ type: CHANGE_PRICE, payload }),
    changeActivatedFilters: payload =>
      dispatch({ type: SET_ACTIVATED_FILTERS, payload })
  })
)(FiltersComponent);
