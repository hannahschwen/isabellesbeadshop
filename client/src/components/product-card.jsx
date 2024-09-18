import { Link } from "react-router-dom";

import "../assets/css/product-card.css";
// import exampleData from "../assets/example-data.json";

function ProductCard(prop) {
  const { _id, category, image, name, price, quantity } = prop.product;
  console.log(prop.selected);
  if (prop.selected == category || prop.selected == "all") {
    return (
      <Link
        to={`/product/${_id}`}
        data-category={category}
        data-stock={quantity}
      >
        <div className="product-card">
          <div className="product-image">
            {/* TODO: put image here... in css it'll be the background image of the div so I can automatically crop it */}
            <img src={image.Url} alt={image.description} />
          </div>
          <p>{name}</p>
          <p>${price}</p>
        </div>
      </Link>
    );
  } else {
    return null;
  }
}

export default ProductCard;
