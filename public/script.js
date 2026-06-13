const inputField = document.querySelector(".link");
const btn = document.querySelector(".link_btn");
const resultDiv = document.getElementById("result");

btn.addEventListener("click", async() => {
    const originalUrl = inputField.value;

    if (!originalUrl) {
        alert("Please enter a URL");
        return;
    }

    try {
        const response = await fetch("/api/shorten", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({originalUrl})
        });

        const data = await response.json();
                
        if (response.ok) {
            resultDiv.innerHTML = `<p>Shortened URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>`;
            inputField.value = ""; //clear input
        } else {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Error connecting to server</p>`;
        console.error(error);
    }
});