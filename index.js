console.log("We are going to experiment with WebOTP!!");

// disable the button
document.querySelector('button').disabled = true;

// add an event listener to input
document.querySelector('input').addEventListener('input', (e) => {
  if (e.target.value && e.target.value.length === 6) {
    document.querySelector('button').disabled = false;
  } else {
    document.querySelector('button').disabled = true;
  }
})

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
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
