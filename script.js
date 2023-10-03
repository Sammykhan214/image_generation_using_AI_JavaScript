const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index) =>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgELement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn")

        //set the image source to the AI-generated image data
        const aiGeneratedImg = `data:image/jpeg; based64, ${imgObject.b64_json}`
        imgELement.src = aiGeneratedImg;

        //When the image is loaded, remove the loading class and set download attributes
        imgELement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImageQuantity) =>{
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization : `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImageQuantity),
                size: "512x512",
                response_format: "b64_json"

            })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again")

        const {data} = await response.json(); //get data response from the fetch request
        updateImageCard([...data]);

    }catch(error){
        alert(error.message);
    }
}

const handleFormSubmission = (e) =>{
    e.preventDefault();
    // console.log(e);


    //Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;

    // creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImageQuantity}, () =>
        `<div class="img-card loading">
            <img src="images/loader.gif" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.jpg" alt="image">
            </a>
        </div>`
    ).join("");

    // console.log(imgCardMarkup);
    // console.log(userPrompt, userImageQuantity);

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImageQuantity);

}

generateForm.addEventListener("submit", handleFormSubmission);