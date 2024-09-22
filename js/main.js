import { getTabs, getProducts } from "./service.js";
import { setLocal, getLocal } from "./local.js";

$(".banner").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  dots: false,
});

const category_list = document.querySelector(".Best_seller_category_list");
const product_list = document.querySelector(".Best_seller_product_list");
const selectedList = document.querySelector(".Selected_items_list");
const modalBtn = document.querySelector(".header__sections_shop_link");

const tabsRender = async () => {
  try {
    const data = await getTabs();
    category_list.innerHTML = data
      .map(
        (item) => `
          <li class="Best_seller_category_item">
            <button class="Best_seller_category_btn">
              ${item}
            </button>
          </li>
        `
      )
      .join("");
    const category_btns = document.querySelectorAll(
      ".Best_seller_category_btn"
    );

    category_btns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          category_btns.forEach((button) =>
            button.classList.remove("category_btn_active")
          );
          btn.classList.add("category_btn_active");
          const productData = await getProducts(btn.textContent.trim());
          productsRender(productData);
        } catch (error) {
          return error.message;
        }
      });
    });

    if (category_btns.length > 0) {
      category_btns[0].click();
    }
  } catch (error) {
    return error.message;
  }
};

const productsRender = (data) => {
  data.forEach((item) => {
    if (item.num === undefined) {
      item.num = 0;
    }
  });

  product_list.innerHTML = data
    .map(
      (item) => `
        <li class="Best_seller_product">
          <div class="Best_seller_product_top">
            <div class="Best_seller_product_img_box">
              <img class="product_img" src="${item.image}" alt="img">
            </div>
            <div class="Best_seller_product_event">
              <div class="Event_btn_wrap">
                <button data-id="${item.id}" class="Event_btn_like">
                  <img src="./img/like.svg" alt="img">
                </button>
                <button data-id="${item.id}" class="Event_btn_buy">
                  <img src="./img/buy.svg" alt="img">
                </button>
              </div>
            </div>
          </div>
          <div class="Best_seller_product__btm">
            <h3 class="Best_seller_product_title">
              ${item.title}
            </h3>
            <p class="Best_seller_product_title al">
              ${item.rating.rate}
            </p>
            <div class="Best_seller_product_wrap">
              <p class="Best_seller_product_price">
                $${item.price}
              </p>
              <p class="Best_seller_product_oldprice">
                $${(item.price / (1 - 0.24)).toFixed(2)}
              </p>
              <p class="Best_seller_product_discount">
                24% Off
              </p>
            </div>
          </div>
        </li>
      `
    )
    .join("");
  const buyBtn = document.querySelectorAll(".Event_btn_buy");
  buyBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedItems = getLocal("selected__items") || [];
      const selectedItem = data.find((item) => item.id == btn.dataset.id);
      if (selectedItem) {
        const existingItem = selectedItems.find(
          (item) => item.id == selectedItem.id
        );
        if (existingItem) {
          existingItem.num += 1;
        } else {
          selectedItem.num = 1;
          selectedItems.push(selectedItem);
        }
        setLocal(selectedItems, "selected__items");
        itemRender(selectedItems);
      }
    });
  });
};

const itemRender = (data) => {
  selectedList.innerHTML = data
    .map(
      (item) => `
      <li class="selected__item">
        <div class="selected__item_first_part">
          <button class="item__delete" data-id="${item.id}">
            X
          </button>
          <div>
            <img class="product_img" src="${item.image}" alt="img">
          </div>
          <h2 class="selected__item__title">
            ${item.title}
          </h2>
        </div>
        <div class="selected__item_second_part"> 
          <p class="item_price">
            $${item.price}
          </p>
          <div class="item_btn_wrap">
            <button class="item_dec_btn" data-id="${item.id}">
              -
            </button>
            <p class="item_qty">
              ${item.num}
            </p>
            <button class="item_inc_btn" data-id="${item.id}">
              +
            </button>
          </div>
          <p class="item_over_price">
            $${(item.price * item.num).toFixed(2)}
          </p>
        </div>
      </li>
    `
    )
    .join("");

  const overSumma = document.querySelector(
    ".header__header__sections_shop_sum"
  );
  const overSum = data.reduce((sum, item) => sum + item.num, 0);
  overSumma.textContent = `${overSum}`;

  const overPrice = document.querySelector(".Subtotal_text");

  const overPr = data.reduce((sum, item) => sum + item.price * item.num, 0);
  overPrice.textContent = `$${overPr}`;

  const totCost = document.querySelector(".total__cost");
  totCost.textContent = `${overPr + 20}`;

  const incBtns = document.querySelectorAll(".item_inc_btn");
  const decBtns = document.querySelectorAll(".item_dec_btn");
  const deleteBtns = document.querySelectorAll(".item__delete");

  incBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = data.find((item) => item.id == id);
      if (item) {
        item.num += 1;
        setLocal(data, "selected__items");
        itemRender(data);
      }
    });
  });

  decBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = data.find((item) => item.id == id);
      if (item) {
        item.num -= 1;
        if (item.num === 0) {
          const index = data.findIndex((i) => i.id == id);
          if (index !== -1) {
            data.splice(index, 1);
          }
        }
        setLocal(data, "selected__items");
        itemRender(data);
      }
    });
  });

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const index = data.findIndex((item) => item.id == id);
      if (index !== -1) {
        data.splice(index, 1);
        setLocal(data, "selected__items");
        itemRender(data);
      }
    });
  });
};

const main_site = document.querySelector(".main_site");
const modal = document.querySelector(".modal");
const home_btn = document.querySelector(".product_selected_home");

modalBtn.addEventListener("click", () => {
  main_site.style.display = "none";
  modal.style.display = "block";
});

home_btn.addEventListener("click", () => {
  main_site.style.display = "block";
  modal.style.display = "none";
});

const selectedItems = getLocal("selected__items") || [];
selectedItems.forEach((item) => {
  if (item.num === undefined) {
    item.num = 0;
  }
});

itemRender(selectedItems);
tabsRender();
