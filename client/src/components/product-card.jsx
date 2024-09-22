import { Link } from "react-router-dom";
import { toDecimal } from "../utils/math";
import "../assets/css/product-card.css";

function ProductCard(prop) {
  console.log(prop.product);
  const { _id, category, image, name, price, quantity, imageURL } =
    prop.product;
  if (prop.selected == category || prop.selected == "all") {
    return (
      <Link
        to={`/product/${_id}`}
        data-category={category}
        data-stock={quantity}
      >
        <div className="product-card">
          <div className="card-image">
            <img
              src={imageURL}
              alt={image.description}
              className="crop-img"
            ></img>
          </div>
          <p>{name}</p>
          <p>${toDecimal(price)}</p>
        </div>
      </Link>
    );
  } else {
    return null;
  }
}

export default ProductCard;
