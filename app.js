import productData from "./data.js";
let cart = [];
let totalPrice = 0;
let walletAmount = 0;
let totalPoints = 0;

// dynamically create a new product ui
function createProductUI() {
  for (let i = 0; i < productData.length; i++) {
    const proRow = $(
      `<div id=${productData[i]?.product} class="mb-4"><h4 class="mb-3">${productData[i]?.product}</h4><div id=${productData[i]?.id} class="row"></div></div>`
    );
    $("#productContainer").append(proRow);
    for (let j = 0; j < productData[i].data.length; j++) {
      const proCol =
        $(`<div class="col-lg-3 col-sm-6 col-6 text-center mb-3"><label for=${
          productData[i].data[j].id
        } class="w-100 d-block p-3 shadow-sm ${
          productData[i].data[j].selected ? "bg-primary text-white" : "bg-light"
        }"><h5>${productData[i].data[j].name}</h5><h6>${
          productData[i].data[j].price
        } x ${productData[i].data[j].qt}</h6><p>${
          productData[i].data[j].details
        }</p><input type="radio" class="form-check-input d-none" value=${
          productData[i].data[j].id
        } name=${productData[i].product} ${
          productData[i].data[j].selected && "checked"
        } id=${productData[i].data[j].id} /></label>
      </div>`);
      $(`#${productData[i]?.id}`).append(proCol);
    }
    $(`input[type=radio][name=${productData[i].product}]`).change(function (e) {
      $(`#${productData[i]?.id}`)
        .find($("label"))
        .removeClass("bg-primary text-white")
        .addClass("bg-light");
      $(this)
        .closest("label")
        .removeClass("bg-light")
        .addClass("bg-primary text-white");
      const foundItem = productData
        .flatMap((product) => product.data)
        .find((item) => item.id === this.value);
      cart = cart.map((item) => {
        return item.category === foundItem.category ? foundItem : item;
      });
      // update all ui elements
      createWalletTable();
      createTotalPrice();
      updateCheckout();
    });
  }
}

// create a wallet
function createWalletAllocation() {
  walletAmount = productData.reduce((total, product) => {
    const productSum = product.data.reduce((productTotal, item) => {
      if (item.selected) {
        return productTotal + item.price * item.qt;
      }
      return productTotal;
    }, 0);
    return total + productSum;
  }, 0);
  $(".walletAmount").text(walletAmount);
}

// create cart table
function createWalletTable() {
  $("#walletBody").empty();
  for (let i = 0; i < cart.length; i++) {
    const tbRow = $(
      `<tr><td>${cart[i].price}</td><td>${cart[i].qt}</td><td>${
        cart[i].price * cart[i].qt
      }</td></tr>`
    );
    $("#walletBody").append(tbRow);
  }
}

// manage cart array
function createCart() {
  cart = productData
    .map((item) => {
      return item.data.filter((i) => {
        return i.selected === true;
      });
    })
    .flat(1);
}

// final calculation
function createTotalPrice() {
  totalPrice = cart.reduce((prev, curr) => {
    return prev + curr.price * curr.qt;
  }, 0);
  $(".cartTotalAmout").text(totalPrice);
  totalPoints = cart.reduce((prev, curr) => {
    return prev + curr.price;
  }, 0);
  $(".cartTotalPoints").text(totalPoints);
}

// checkout logic
function updateCheckout() {
  const usedAmmount = totalPrice > walletAmount ? walletAmount : totalPrice;
  $(".usedAmmount").text(usedAmmount);
  const availableAmmount =
    walletAmount > totalPrice ? walletAmount - totalPrice : 0;
  $(".availableAmmount").text(availableAmmount);
  const payAmmount = totalPrice > walletAmount ? totalPrice - walletAmount : 0;
  $(".payAmmount").text(payAmmount);
}

// dynamically generate a invoice UI
function showInvoice() {
  $("#btn-checkout").click(function () {
    $("input[type=radio]").attr("disabled", true);
    $(".invoiceContainer").fadeIn();
    for (let i = 0; i < cart.length; i++) {
      const tbRow = $(
        `<tr><td>${cart[i].name}</td><td>${cart[i].details}</td><td>${
          cart[i].price
        }</td><td>${cart[i].qt}</td><td>${cart[i].price * cart[i].qt}</td></tr>`
      );
      $("#invoiceBody").append(tbRow);
    }
    // auto scroll invoice section
    setTimeout(() => {
      $("html, body").animate(
        {
          scrollTop: $(".invoiceContainer").offset().top,
        },
        100
      );
    }, 1000);
  });
}

(function () {
  createCart();
  createProductUI();
  createWalletAllocation();
  createWalletTable();
  createTotalPrice();
  updateCheckout();
  showInvoice();
})();
