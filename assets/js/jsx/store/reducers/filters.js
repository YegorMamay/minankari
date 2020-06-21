import { sortByValues, config } from "./../../config/env";

export const FETCH_FILTERS_START = "FETCH_FILTERS_START";
export const FETCH_FILTERS_COMPLETED = "FETCH_FILTERS_COMPLETED";
export const FETCH_FILTERS_ERROR = "FETCH_FILTERS_ERROR";
export const CHANGE_PRICE = "CHANGE_PRICE";
export const CHANGE_IN_STOCK_STATUS = "CHANGE_IN_STOCK_STATUS";
export const CHANGE_PRE_ORDER_STATUS = "CHANGE_PRE_ORDER_STATUS";
export const CHANGE_SORT_TYPE = "CHANGE_SORT_TYPE";
export const SET_ACTIVATED_FILTERS = "SET_ACTIVATED_FILTERS";
export const RESTORE_FILTERS = "RESTORE_FILTERS";
export const SET_ON_SALE = "SET_ON_SALE";
export const RESTORE_COMPLETED = "RESTORE_COMPLETED";

const initialState = {
  filters: [],
  activatedFilters: {},
  fetching: false,
  fetched: false,
  error: null,
  price: [0, 0],
  defaultPrice: [0, 0],
  inStock: false,
  preOrder: false,
  sortBy: sortByValues.PRICE_DESC,
  onSale: false,
  category: config.Category,
  restored: false
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILTERS_START: {
      return { ...state, fetching: true };
    }
    case FETCH_FILTERS_COMPLETED: {
      return {
        ...state,
        fetched: true,
        filters: Object.values(action.payload.Data),
        defaultPrice: [+action.payload.MinPrice, +action.payload.MaxPrice],
        price: [+action.payload.MinPrice, +action.payload.MaxPrice],
        fetching: false
      };
    }
    case FETCH_FILTERS_ERROR: {
      return { ...state, error: action.payload, fetching: false };
    }
    case CHANGE_IN_STOCK_STATUS: {
      return { ...state, inStock: action.payload };
    }
    case CHANGE_PRE_ORDER_STATUS: {
      return { ...state, preOrder: action.payload };
    }
    case CHANGE_SORT_TYPE: {
      return { ...state, fetching: true, sortBy: action.payload };
    }
    case CHANGE_PRICE: {
      return { ...state, price: action.payload };
    }
    case SET_ACTIVATED_FILTERS: {
      const filters = state.activatedFilters;
      const [slug, value] = action.payload;

      if (slug in filters) {
        if (filters[slug].indexOf(value) !== -1) {
          filters[slug] = filters[slug].filter(x => x !== value);
        } else {
          filters[slug].push(value);
        }
      } else {
        filters[slug] = [value];
      }

      return { ...state, activatedFilters: filters };
    }
    case SET_ON_SALE: {
      return { ...state, onSale: true };
    }
    case RESTORE_COMPLETED: {
      return { ...state, restored: true };
    }
    default: {
      return state;
    }
  }
};
