console.log("We are going to experiment with WebOTP!!");

// add an event listener to input
document.querySelector("input").addEventListener("input", (e) => {
  if (e.target.value && e.target.value.length === 6) {
    document.querySelector("button").disabled = false;
  } else {
    document.querySelector("button").disabled = true;
  }
});

/**
 * Modularized function for listening to OTP
 * @param {HTMLElement} inputElement Element which we need to fill after OTP is received
 * @param {Function} onOTPReceiveSuccess Function to be called when OTP has been successfully received
 * @param {Function} onOTPReceiveFail Function to be called when OTP cannot be retreived
 * @param {number} duration Duration till which we want to listen for OTP (in seconds)
 * @returns An abort controller which you can abort if you want to stop listening for OTP
 */
function addOTPfunctionality(
  inputElement,
  onOTPReceiveSuccess,
  onOTPReceiveFail,
  duration,
  afterTimerExpiry
) {
  // if OTP is supported
  if ("OTPCredential" in window) {
    // a variable for abort controller which will be returned
    const ac = new AbortController();

    // check for duration completion
    if (duration && typeof duration === "number") {
      setTimeout(() => {
        ac.abort();
        if (afterTimerExpiry) afterTimerExpiry();
      }, duration * 1000);
    }

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
  },
  60,
  () => {
    const tip = document.createElement("h3");
    tip.style.marginTop = "16px";
    tip.style.color = "#1565c0";
    tip.style.textAlign = "center";
    tip.innerText = "Please manually enter the OTP";
    document.querySelector(".panel").appendChild(tip);
  }
);

const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ac.abort();
    alert("got the OTP and submitted the form!!");
  });
} else {
  console.error("form not found");
}
