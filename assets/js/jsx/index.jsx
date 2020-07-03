import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import FiltersComponent from "./components/Filters.jsx";
import ProductsComponent from "./components/Products.jsx";
import SortByComponent from "./components/SortBy.jsx";
import { RESTORE_FILTERS } from "./store/reducers/filters";
import { config } from "./config/env";

export class App extends React.Component {
  componentDidMount() {
    store.dispatch({ type: RESTORE_FILTERS });
  }

  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <h2 class="text-left bw-header">
            <span>{config.PageHeader}</span>
            <SortByComponent />
          </h2>
          <div className="bwpf-wrapper row">
            <div className="filters-wrapper col-md-2 col-xs-12">
              <FiltersComponent />
            </div>
            <div className="products-wrapper col-md-10 col-xs-12">
              <ProductsComponent />
            </div>
          </div>
        </Provider>
      </div>
    );
  }
}

render(<App />, document.querySelector("#bwpf"));
