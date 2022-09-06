/**
 * Modularized function for listening to OTP
 * @param {HTMLElement} inputElement Element which we need to fill after OTP is received
 * @param {Function} onOTPReceiveSuccess Function to be called when OTP has been successfully received
 * @param {Function} onOTPReceiveFail Function to be called when OTP cannot be retreived
 * @param {number} duration Duration till which we want to listen for OTP (in seconds)
 * @returns An abort controller which you can abort if you want to stop listening for OTP
 */
export function addOTPFunctionality(
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
