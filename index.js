import { addOTPFunctionality } from "./addOTPFunctionality.js";

console.log("We are going to experiment with WebOTP!!");

// add an event listener to input
document.querySelector("input").addEventListener("input", (e) => {
  if (e.target.value && e.target.value.length === 6) {
    document.querySelector("button").disabled = false;
  } else {
    document.querySelector("button").disabled = true;
  }
});

const ac = addOTPFunctionality(
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
