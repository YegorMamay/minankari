import {
  FETCH_FILTERS_COMPLETED,
  SET_ACTIVATED_FILTERS,
  CHANGE_PRICE,
  CHANGE_PRE_ORDER_STATUS,
  CHANGE_IN_STOCK_STATUS,
  CHANGE_SORT_TYPE
} from "../reducers/filters";
import {
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_COMPLETED,
  INC_PAGE
} from "../reducers/products";

const paramsToString = params => {
  const queryParams = [];
  Object.keys(params).map(key => {
    const value = params[key];
    if (value && value.length) queryParams.push([key, value.join(",")]);
  });
  if (queryParams.length) {
    return `?${queryParams.map(param => param.join("=")).join("&")}`;
  } else {
    return "";
  }
};

const fetchProducts = params =>
  fetch(
    `/wp-json/brainworks/products${paramsToString(params)}`
  ).then(response => response.json());

export const productsMiddleware = store => next => action => {
  const returnedValue = next(action);
  const state = store.getState();
  const { page, limit } = state.products;
  const {
    activatedFilters,
    price,
    defaultPrice,
    category,
    onSale,
    preOrder,
    restored,
    sortBy
  } = state.filters;

  if (!price[0] && !price[1]) {
    price[0] = defaultPrice[0];
    price[1] = defaultPrice[1];
  }

  switch (action.type) {
    case FETCH_FILTERS_COMPLETED:
    case SET_ACTIVATED_FILTERS:
    case CHANGE_PRICE:
    case CHANGE_PRE_ORDER_STATUS:
    case CHANGE_IN_STOCK_STATUS:
    case CHANGE_SORT_TYPE:
    case INC_PAGE: {
      if (restored) {
        store.dispatch({ type: FETCH_PRODUCTS_START });
        const params = {
          ...activatedFilters,
          minPrice: [price[0]],
          maxPrice: [price[1]],
          page: [page],
          limit: [limit],
          sort_by: [sortBy]
        };

        if (preOrder) params.pre_order = [true];
        if (onSale) params.on_sale = [true];
        if (category) params.category = [category];

        fetchProducts(params).then(data => {
          store.dispatch({
            type: FETCH_PRODUCTS_COMPLETED,
            payload: { ...data, Rewrite: action.type !== INC_PAGE }
          });
        });
      }
    }
    default: {
      break;
    }
  }

  return returnedValue;
};
