console.log("We are going to experiment with WebOTP!!");

// if OTP is supported
if ("OTPCredential" in window) {
  // when DOM has loaded
  window.addEventListener("DOMContentLoaded", (e) => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        ac.abort();
        alert("got the OTP and submitted the form!!");
      });
    } else {
        console.error('form not found');
    }
    navigator.credentials
      .get({
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otp) => {
        input.value = otp.code;
        console.log("OTP received - ", otp.code);
        if (form) form.submit();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
