<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section class="py-5">
    <div class="container px-5">
      <!-- Contact form-->
      <div class="bg-light rounded-3 py-5 px-4 px-md-5 mb-5">
        <div class="text-center mb-5">
          <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3">
            <i class="bi bi-people"></i>
          </div>
          <h1 class="fw-bolder">Get Start</h1>
          <p class="lead fw-normal text-muted mb-0">
            We'd love to hear from you
          </p>
        </div>
        <div class="row gx-5 justify-content-center">
          <div class="col-lg-8 col-xl-6">
            <!-- * * * * * * * * * * * * * * *-->
            <!-- * * SB Forms Contact Form * *-->
            <!-- * * * * * * * * * * * * * * *-->
            <!-- This form is pre-integrated with SB Forms.-->
            <!-- To make this form functional, sign up at-->
            <!-- https://startbootstrap.com/solution/contact-forms-->
            <!-- to get an API token!-->
            <form id="contactForm" data-sb-form-api-token="API_TOKEN">
              <!-- Name input-->
              <div class="form-floating mb-3">
                <input
                  class="form-control"
                  id="id"
                  ref="id"
                  type="text"
                  placeholder="Enter your id..."
                  data-sb-validations="required"
                  v-model="mbrId"
                />
                <label for="id">아이디를 입력해주세요</label>
                <div class="invalid-feedback" data-sb-feedback="id:required">
                  A ID is required.
                </div>
              </div>
              <div class="form-floating mb-3">
                <input
                  class="form-control"
                  id="password"
                  type="password"
                  placeholder="Enter your password..."
                  data-sb-validations="required"
                  v-model="mbrPw"
                />
                <label for="id">비밀번호를 입력해주세요</label>
                <div
                  class="invalid-feedback"
                  data-sb-feedback="password:required"
                >
                  A Password is required.
                </div>
              </div>
              <!-- Submit success message-->
              <!---->
              <!-- This is what your users will see when the form-->
              <!-- has successfully submitted-->
              <div class="d-none" id="submitSuccessMessage">
                <div class="text-center mb-3">
                  <div class="fw-bolder">Form submission successful!</div>
                  To activate this form, sign up at
                  <br />
                  <a href="https://startbootstrap.com/solution/contact-forms"
                    >https://startbootstrap.com/solution/contact-forms</a
                  >
                </div>
              </div>
              <!-- Submit error message-->
              <!---->
              <!-- This is what your users will see when there is-->
              <!-- an error submitting the form-->
              <!-- <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">Error sending message!</div></div> -->
              <!-- Submit Button-->
              <div class="d-grid" @click="goLogin">
                <button
                  class="btn btn-primary btn-lg disabled"
                  id="submitButton"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- Contact cards-->
      <div class="row gx-5 row-cols-2 row-cols-lg-4 py-5">
        <div class="col">
          <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3">
            <i class="bi bi-chat-dots"></i>
          </div>
          <div class="h5 mb-2">Chat with us</div>
          <p class="text-muted mb-0">
            Chat live with one of our support specialists.
          </p>
        </div>
        <div class="col">
          <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3">
            <i class="bi bi-people"></i>
          </div>
          <div class="h5">Ask the community</div>
          <p class="text-muted mb-0">
            Explore our community forums and communicate with other users.
          </p>
        </div>
        <div class="col">
          <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3">
            <i class="bi bi-question-circle"></i>
          </div>
          <div class="h5">Support center</div>
          <p class="text-muted mb-0">
            Browse FAQ's and support articles to find solutions.
          </p>
        </div>
        <div class="col">
          <div class="feature bg-primary bg-gradient text-white rounded-3 mb-3">
            <i class="bi bi-telephone"></i>
          </div>
          <div class="h5">Call us</div>
          <p class="text-muted mb-0">
            Call us during normal business hours at (555) 892-9403.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      mbrId: "",
      mbrPw: "",
    };
  },
  components: {},
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  methods: {
    ...mapActions("login", ["doLogin"]),

    goLogin() {
      if (this.mbrId == "") {
        this.$refs.id.focus();
        alert("아이디를 입력해주세요.");
        return;
      }

      let params = {
        mbrId: this.mbrId,
        mbrPw: this.mbrPw,
      };

      this.doLogin(params)
        .then(() => {
          this.$router.push({ path: "main" });
        })
        .catch((error) => {
          switch (error.message) {
            case "1000": // 아이디 암호 오류
              this.$refs.id.focus();
              alert("아이디 또는 패스워드가 올바르지 않습니다.");
              break;
            case "1001": // 아이디 암호 오류
              this.$refs.id.focus();
              alert("아이디 또는 패스워드가 올바르지 않습니다.");
              break;
            default:
              alert("정보를 불러오는중 에러가 발생하였습니다.");
              break;
          }
        });
    },
  },
};
</script>