if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
}

let contactInformation;
let profilePicture;

const contactImage = document.getElementById("contact-image");
const contactInformationText = document.getElementById("contact-information-text");
const selectButton = document.getElementById("choose-button");
const shareButton = document.getElementById("share-button");

selectButton.addEventListener("click", async function () {
    if ("contacts" in navigator && "ContactsManager" in window) {
        const properties = ["name", "email", "address", "icon"];
        const options = {multiple: false};

        const contact = (await navigator.contacts.select(properties, options))[0];

        contactInformation = "";
        profilePicture = undefined;

        contactInformationText.value = "";
        contactImage.src = "";

        const name = contact.name[0];
        const email = contact.email[0];
        const address = contact.address[0];
        const icon = contact.icon[0];

        if (name) contactInformation += `Name: ${name}\n`;
        if (email) contactInformation += `Nummer: ${email}\n`;
        if (address) contactInformation += `Adresse: ${address}\n`;
        contactInformation += "\n";
        if (icon) profilePicture = new File([icon], `${name}.jpg`, {type: "image/jpeg"});

        contactInformationText.innerHTML = contactInformation.replace("\n", "<br>");

        if (profilePicture) {
            const fr = new FileReader();
            fr.onload = () => contactImage.src = fr.result;
            fr.readAsDataURL(profilePicture);
        }

        shareButton.style.display = "block";
    } else {
        contactInformationText.value = "Contact Picker API is not supported.";
    }
});

shareButton.addEventListener("click", async function () {
    if (navigator.share) {
        navigator.share({
            text: contactInformation,
            files: profilePicture ? [profilePicture] : undefined,
        })
            .then(() => console.log("Successful share"))
            .catch((error) => console.log("Error sharing", error));
    } else {
        contactImage.value = "Web Share API is not supported.";
    }
});



