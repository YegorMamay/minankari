import React from "react";
import { connect } from "react-redux";
import { INC_PAGE } from "./../store/reducers/products";

export const ProductsLoadMoreComponent = ({ onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className="bw-load-more"
      onClick={(_) => onClick()}
    >
      {window._translationDictionary.get("ЗАГРУЗИТЬ ЕЩЕ 20 ТОВАРОВ")}
    </button>
  );
};

export const ProductsLoadSpinnerComponent = () => (
  <div class="spinner-wrapper">
    <div class="spinner"></div>
  </div>
);

export const ProductsItemComponent = ({
  Title,
  PictureUrl,
  Permalink,
  RegularPrice,
  SalePrice,
  CategoryName, 
  CategorySlug,
}) => (
  <a href={Permalink} className="product-item">
    {SalePrice ? (
      <span className="on-sale-label">
        {window._translationDictionary.get("Распродажа")}
      </span>
    ) : null}
    <div>
      <div className="image">
        <img src={PictureUrl} alt="" title={Title} />
      </div>
      <h4>{Title}</h4>
      <span className="type">
        {CategoryName.map((name, index) => (
          <>
            <a href={`/product-category/${CategorySlug[index]}`}>{name}</a>
            {index !== CategoryName.length - 1 ? ", " : ""}
          </>
        ))}
      </span>
    </div>
    <div>
      <div className="price-container">
        <span className="price">
          {SalePrice || RegularPrice} {window._translationDictionary.get("грн")}
        </span>
        {SalePrice ? (
          <span className="price-regular">
            {RegularPrice} {window._translationDictionary.get("грн")}
          </span>
        ) : null}
      </div>
      <span href={Permalink} className="btn">
        {window._translationDictionary.get("Подробнее")}
      </span>
    </div>
  </a>
);

export class ProductsComponent extends React.Component {
  loadMoreProducts() {
    this.props.incrementPage();
  }

  render() {
    const { products, total, limit, page, fetching } = this.props.products;

    return (
      <div className={["bw-grid-wrapper", fetching ? "loading" : ""].join(" ")}>
        <div className="bw-grid">
          {products.map((product, index) => (
            <ProductsItemComponent key={index} {...product} />
          ))}
        </div>

        {limit * page < total ? (
          <ProductsLoadMoreComponent
            onClick={this.loadMoreProducts.bind(this)}
            disabled={fetching}
          />
        ) : null}

        {fetching ? <ProductsLoadSpinnerComponent /> : null}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    products: state.products,
  }),
  (dispatch) => ({
    incrementPage: () => dispatch({ type: INC_PAGE }),
  })
)(ProductsComponent);
