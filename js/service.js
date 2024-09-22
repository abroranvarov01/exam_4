const url = "https://fakestoreapi.com/products/categories";
const url_2 = "https://fakestoreapi.com/products/category";

export const getTabs = async () => {
  try {
    const res = await fetch(`${url}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return error.message;
  }
};

export const getProducts = async (name) => {
  try {
    const res = await fetch(`${url_2}/${name}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return error.message;
  }
};
