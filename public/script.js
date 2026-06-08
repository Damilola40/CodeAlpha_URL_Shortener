const inputField = document.querySelector(".link");
const btn = document.querySelector(".link_btn");

btn.addEventListener("click", async() => {
    const originalURL = inputField.value;

    if (!originalURL) {
        alert("Please enter a URL");
        return;
    }

    try {
        const response = await fetch("/api/shorten", {
            method: "POST",
            headers: {"Content-Type": "applicatio/json"},
            body: JSON.stringify({originalURL})
        });

        const data = await response.json();
                
        if (response.ok) {
            alert("Shortened URL: ${data.shortUrl}");
            inputField = ""; //clear input
        } else {
            alert("Error: ${data.error}");
        }
    } catch (error) {
        alert("Error connecting to server");
        console.error(error);
    }
});