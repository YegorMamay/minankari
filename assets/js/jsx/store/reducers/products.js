export const FETCH_PRODUCTS_START = "FETCH_PRODUCTS_START";
export const FETCH_PRODUCTS_COMPLETED = "FETCH_PRODUCTS_COMPLETED";
export const FETCH_PRODUCTS_ERROR = "FETCH_PRODUCTS_ERROR";
export const INC_PAGE = "INC_PAGE";

const initialState = {
  fetching: false,
  fetched: false,
  products: [],
  error: null,
  limit: 20,
  page: 1,
  total: 0
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_START: {
      return { ...state, fetching: true };
    }
    case FETCH_PRODUCTS_COMPLETED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        products: action.payload.Rewrite
          ? action.payload.Data || []
          : [...state.products, ...(action.payload.Data || [])],
        total: +action.payload.Total
      };
    }
    case FETCH_PRODUCTS_ERROR: {
      return { ...state, error: action.payload, fetching: false };
    }
    case INC_PAGE: {
      return { ...state, page: state.page + 1 };
    }
    default: {
      return state;
    }
  }
};
