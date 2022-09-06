console.log("We are going to experiment with WebOTP!!");

// add an event listener to input
document.querySelector("input").addEventListener("input", (e) => {
  if (e.target.value && e.target.value.length === 6) {
    document.querySelector("button").disabled = false;
  } else {
    document.querySelector("button").disabled = true;
  }
});

// creating a function that can be modularized
function addOTPfunctionality(
  inputElement,
  onOTPReceiveSuccess,
  onOTPReceiveFail
) {
  // if OTP is supported
  if ("OTPCredential" in window) {
    // a variable for abort controller which will be returned
    const ac = new AbortController();

    // when DOM has loaded
    window.addEventListener("DOMContentLoaded", (e) => {
      if (!inputElement) return;
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          inputElement.value = otp.code;
          onOTPReceiveSuccess(otp);
        })
        .catch((err) => {
          onOTPReceiveFail(err);
        });
    });
    return ac;
  } else return undefined;
}

const ac = addOTPfunctionality(
  document.querySelector('input[autocomplete="one-time-code"]'),
  (otp) => {
    document.querySelector("button").disabled = false;
    console.log("OTP received - ", otp.code);
  },
  (err) => {
    console.error(err);
  }
);

const form = inputElement.closest("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ac.abort();
    alert("got the OTP and submitted the form!!");
  });
} else {
  console.error("form not found");
}
