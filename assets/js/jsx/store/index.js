import { createStore, combineReducers, applyMiddleware } from "redux";
import { reducer as filtersReducer } from "./reducers/filters";
import { reducer as productsReducer } from "./reducers/products";
import thunk from "redux-thunk";
import { productsMiddleware } from "./middlewares/products";
import { filtersRestoreMiddleware } from "./middlewares/filters-restore";

const reducer = combineReducers({
  filters: filtersReducer,
  products: productsReducer
});
const middleware = applyMiddleware(
  thunk,
  productsMiddleware,
  filtersRestoreMiddleware
);

export const store = createStore(reducer, middleware);
