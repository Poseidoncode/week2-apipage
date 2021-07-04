import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

createApp({
  data() {
    return {
      baseUrl: "https://vue3-course-api.hexschool.io",

      username: "",
      password: "",
    };
  },
  methods: {
    // login() {
    //   alert(123);
    // },
    async login() {
      const api = `${this.baseUrl}/admin/signin`;

      const obj = {
        username: this.username,
        password: this.password,
      };

      try {
        const res = await axios.post(api, obj);
        const isFail = res.data.message == "登入失敗" ? true : false;
        if (isFail) {
          alert("登入失敗");
        } else {
          alert("登入成功");
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          window.location.assign("index.html");
        }
      } catch (error) {
        alert(error);
      }
    },
  },
}).mount("#app");
