import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

let productModal = "";
let delProductModal = "";

createApp({
  data() {
    return {
      baseUrl: "https://vue3-course-api.hexschool.io/api",
      apiPath: "poseidon",
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    async getData(page = 1) {
      const url = `${this.baseUrl}/${this.apiPath}/admin/products?page=${page}`;
      try {
        const res = await axios.get(url);
        if (res.data.success) {
          this.products = res.data.products;
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert(error);
      }
    },

    updateProduct() {
      if (this.isNew) {
        this.products.push({
          id: Date.now(),
          ...this.tempProduct,
        });

        this.tempProduct = {
          imagesUrl: [],
        };
        productModal.hide();
      } else {
        // findIndex 用法參考
        // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
        const index = this.products.findIndex(
          (item) => item.id === this.tempProduct.id
        );
        this.products[index] = this.tempProduct;
        productModal.hide();
      }
    },
    openModal(isNew, item) {
      if (isNew === "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    async delProduct() {
      const url = `${this.baseUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      try {
        const res = await axios.delete(url);
        if (res.data.success) {
          this.getData();
          delProductModal.hide();
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert(error);
      }
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById("productModal"));

    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );

    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!Boolean(token)) {
      alert("請確實進行登入。");
      window.location.assign("login.html");
    }
    axios.defaults.headers.common["Authorization"] = token;
    this.getData();
  },
}).mount("#app");
