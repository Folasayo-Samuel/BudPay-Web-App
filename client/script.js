document.addEventListener("DOMContentLoaded", () => {
  const generateTokenBtn = document.getElementById("generateTokenBtn");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutResult = document.getElementById("checkoutResult");

  generateTokenBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get("/generate-token");
      const token = response.data;

      // Show the generated token
      checkoutResult.innerHTML = `<p>Generated Token: ${token}</p>`;
    } catch (error) {
      console.error(error);
      checkoutResult.innerHTML =
        "<p>An error occurred while generating the token.</p>";
    }
  });

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emailInput").value;
    const amount = document.getElementById("amountInput").value;
    const currency = document.getElementById("currencyInput").value;

    try {
      const response = await axios.post("/checkout", {
        email,
        amount,
        currency,
      });

      // Show the checkout link
      checkoutResult.innerHTML = response.data;
    } catch (error) {
      console.error(error);
      checkoutResult.innerHTML =
        "<p>An error occurred while initializing the transaction.</p>";
    }
  });
});
