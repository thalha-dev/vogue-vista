import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearStatus,
  errorMessageCB,
  errorMessageFromCB,
  uploadNewShoe,
  uploadNewShoeStatusCB,
} from "../../state/slice/shoeSlice";
import { toast } from "react-toastify";

const UploadShoe = () => {
  const [shoeName, setShoeName] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeColor, setShoeColor] = useState("");
  const [shoeImages, setShoeImages] = useState("");
  const [shoeRating, setShoeRating] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoesAvailable, setShoesAvailable] = useState("");
  const [shoeGenderCategory, setShoeGenderCategory] = useState("");
  const dispatch = useDispatch();
  const uploadNewShoeStatus = useSelector(uploadNewShoeStatusCB);
  const errorMessage = useSelector(errorMessageCB);
  const errorMessageFrom = useSelector(errorMessageFromCB);

  const handleNotify = (message, cause) => {
    if (cause === "uploadNewShoeFailed") {
      toast.error(message);
      setTimeout(() => {
        dispatch(clearStatus("uploadNewShoeStatus"));
      }, 500);
    }
    if (cause === "uploadNewShoeSuccess") {
      toast.success(message);
      setTimeout(() => {
        dispatch(clearStatus("uploadNewShoeStatus"));
      }, 500);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const params = {
      shoeName,
      shoeSize,
      shoeBrand,
      shoeColor,
      shoeImages,
      shoeRating,
      shoePrice,
      shoesAvailable,
      shoeGenderCategory,
    };
    dispatch(uploadNewShoe(params));
  };

  return (
    <div className="upload-shoe-container">
      <h1>SHOE INFO</h1>
      <form
        className="upload-shoe-form"
        onSubmit={handleFormSubmit}
        encType="multipart/form-data"
      >
        <input
          className="upload-shoe-name"
          type="text"
          placeholder={"Shoe Name"}
          value={shoeName}
          onChange={(e) => setShoeName(e.target.value)}
        />
        <input
          className="upload-shoe-color"
          type="text"
          placeholder={"Shoe Color"}
          value={shoeColor}
          onChange={(e) => setShoeColor(e.target.value)}
        />
        <input
          className="upload-shoe-brand"
          type="text"
          placeholder={"Shoe Brand"}
          value={shoeBrand}
          onChange={(e) => setShoeBrand(e.target.value)}
        />
        <input
          className="upload-shoe-size"
          type="number"
          placeholder={"Shoe Size"}
          value={shoeSize}
          onChange={(e) => setShoeSize(e.target.value)}
        />
        <input
          className="upload-shoe-available"
          type="number"
          placeholder={"Shoe Available Quantity"}
          value={shoesAvailable}
          onChange={(e) => setShoesAvailable(e.target.value)}
        />
        <input
          className="upload-shoe-price"
          type="number"
          placeholder={"Shoe Price"}
          value={shoePrice}
          onChange={(e) => setShoePrice(e.target.value)}
        />
        <input
          className="upload-shoe-rating"
          type="number"
          placeholder={"Shoe Rating"}
          value={shoeRating}
          onChange={(e) => setShoeRating(e.target.value)}
        />
        <div className="upload-shoe-gender-category">
          <label htmlFor="upload-shoe-gender-category-label">
            Gender Category
          </label>
          <select
            id="upload-shoe-gender-category-label"
            value={shoeGenderCategory}
            onChange={(e) => {
              setShoeGenderCategory(e.target.value);
            }}
          >
            <option value="">Not Selected</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>
        <div className="upload-shoe-image-container">
          <label htmlFor="upload-shoe-image-label">Select Shoe Images</label>
          <input
            id="upload-shoe-image-label"
            className="upload-shoe-image"
            type="file"
            name="shoeImages"
            multiple
            onChange={(e) => setShoeImages(e.target.files)}
          />
        </div>
        <button type="submit" className="upload-shoe-submit-button">
          SUBMIT
        </button>
      </form>
      {uploadNewShoeStatus === "success" &&
        handleNotify("Shoe Upload Success", "uploadNewShoeSuccess")}
      {uploadNewShoeStatus === "failed" &&
        errorMessageFrom === "uploadNewShoe" &&
        handleNotify(errorMessage, "uploadNewShoeFailed")}
    </div>
  );
};

export default UploadShoe;
