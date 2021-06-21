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
    async renewProduct() {
      const obj = {};
      obj.data = { ...this.tempProduct };
      obj.data.price = +this.tempProduct.price;
      obj.data.origin_price = +this.tempProduct.origin_price;
      const url = this.isNew
        ? `${this.baseUrl}/${this.apiPath}/admin/product`
        : `${this.baseUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      try {
        const res = this.isNew
          ? await axios.post(url, obj)
          : await axios.put(url, obj);
        if (res.data.success) {
          this.getData();
          productModal.hide();
          this.isNew ? alert("新增成功") : alert("修改成功");
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert(error);
      }
    },
    openModal(isNew, item) {
      if (isNew === "new") {
        this.tempProduct = {
          title: "",
          category: "",
          origin_price: 0,
          price: 0,
          unit: "",
          description: "",
          content: "",
          is_enabled: false,
          imageUrl: "",
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
          alert("刪除成功");
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert(error);
      }
    },
    addNewImage() {
      this.tempProduct.imagesUrl.push(this.tempProduct.imageUrl);
      this.tempProduct.imageUrl = "";
    },
    removeImage() {
      this.tempProduct.imagesUrl.shift();
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
