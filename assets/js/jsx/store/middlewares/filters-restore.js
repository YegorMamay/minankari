import {
  RESTORE_FILTERS,
  CHANGE_PRICE,
  SET_ACTIVATED_FILTERS,
  SET_ON_SALE,
  CHANGE_PRE_ORDER_STATUS,
  RESTORE_COMPLETED
} from "../reducers/filters";

export const filtersRestoreMiddleware = store => next => action => {
  const returnedValue = next(action);

  if (action.type === RESTORE_FILTERS) {
    if (location.search)
      location.search
        .slice(1)
        .split("&")
        .map(arr => arr.split("="))
        .forEach(([key, value]) => {
          if (key === "price") {
            store.dispatch({
              type: CHANGE_PRICE,
              payload: value.split(",").map(x => +x)
            });
          } else if (key.indexOf("pa_") !== -1) {
            value.split(",").forEach(x =>
              store.dispatch({
                type: SET_ACTIVATED_FILTERS,
                payload: [key, x]
              })
            );
          } else if (key === "on_sale") {
            store.dispatch({ type: SET_ON_SALE });
          } else if (key === "pre_order") {
            store.dispatch({ type: CHANGE_PRE_ORDER_STATUS, payload: true });
          }
        });
    store.dispatch({ type: RESTORE_COMPLETED });
  } else {
    const {
      activatedFilters,
      price,
      defaultPrice,
      preOrder
    } = store.getState().filters;
    const activatedFiltersKeys = Object.keys(activatedFilters);
    const params = {};

    if (activatedFiltersKeys.length > 0) {
      activatedFiltersKeys.forEach(key => {
        if (activatedFilters[key] && activatedFilters[key].length > 0)
          params[key] = activatedFilters[key].join(",");
      });
    }

    if (
      (price[0] !== defaultPrice[0] || price[1] !== defaultPrice[1]) &&
      !!price[1] &&
      !!defaultPrice[1]
    ) {
      params.price = price.join(",");
    }

    if (preOrder) {
      params.pre_order = true;
    }

    let url = "?";
    for (let key in params) url += key + "=" + params[key] + "&";
    if (url.length > 1) {
      history.pushState({}, document.title, url.slice(0, -1));
    }
  }

  return returnedValue;
};
