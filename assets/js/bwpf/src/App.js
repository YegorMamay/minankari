import React from "react";
import { Provider } from "react-redux";
import store from "./store";

import FiltersComponent from "./components/Filters";
import ProductsComponent from "./components/Products";
import PaginationComponent from "./components/Pagination";

function App() {
  return (
    <Provider store={store}>
      <div className="bw-container">
        <div className="row">
          <div className="col-md-2">
            <FiltersComponent />
          </div>
          <div className="col-md-10">
            <ProductsComponent />
            <PaginationComponent />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
