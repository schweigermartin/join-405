let contacts = [];
let loadedContacts = [];

const BASE_URL = "https://join-405-43178-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadAllContacts(path=""){
    let response = await fetch (BASE_URL + path + ".json");
    let responsToJason = await response.json();

    loadedContacts = [];
    const usersArray = (Object.values(responsToJason.users));
    usersArray.forEach((x) => {
        let [vorname, nachname] = x.name.split(" ");
        let initialien = vorname[0] + nachname[0];
        const user = {name: x.name, email: x.email, phone: x.phone, letter: x.name.trim().charAt(0), initialien: initialien};
        loadedContacts.push(user);   
    });
    renderContacts(loadedContacts);
}

function renderContacts(){
    let contentRef = document.getElementById('contacts');
    contentRef.innerHTML = "";
    let currentLetter = "";
    loadedContacts.sort((a, b) => a.name.localeCompare(b.name));

    for (let index = 0; index < loadedContacts.length; index++) {
        let [vorname, nachname] = loadedContacts[index].name.split(" ");
        let initialien = vorname[0] + nachname[0];
        let firstLetter = loadedContacts[index].name.slice(0, 1);
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contentRef.innerHTML += renderCurrentLetter(currentLetter);
        }
        const groupElement = document.getElementById(`contact-container-${currentLetter}`);
        if (groupElement) {
            groupElement.innerHTML += renderCurrentContacts(index, initialien, vorname, nachname);
            addBackgrounds();
        } else {
            console.warn(`Gruppe mit der ID 'contact-container-${currentLetter}' wurde nicht gefunden.`);
        }
    }
}

function addBackgrounds() {
    const avatars = document.querySelectorAll('.contact-avatar');
    avatars.forEach(avatar => {
        avatar.style.backgroundColor = getRandomColor();
    });
}

function getRandomColor() {
    const colors = ['#6A8EAE','#F4A261', '#2A9D8F', '#E76F51', '#264653', '#A2678A','#457B9D', '#D4A373', '#8A817C', '#BC6C25'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function openContactDetailsOverlay(index){
    console.log(`Kontakt ${index} wurde geklickt!`);
    console.log(loadedContacts[index]);

    document.getElementById('content-wrapper-id').classList.add('d-none');
    let contentRef = document.getElementById('contact-details-wrapper-id');
    contentRef.classList.remove('d-none');
    contentRef.innerHTML = HTMLopenContactDetailsOverlay(index);
    
}

function closeContactDetailsOverlay(){
    document.getElementById('content-wrapper-id').classList.remove('d-none');
    let contentRef = document.getElementById('contact-details-wrapper-id');
    contentRef.classList.add('d-none');
    contentRef.innerHTML = "";
}

function OpenAddContactOverlay(){
    document.getElementById('content-wrapper-id').classList.add('d-none');
    let contentRef = document.getElementById('overlay-wrapper-id');
    contentRef.innerHTML = HTMLOpenAddContactOverlay();
    contentRef.classList.remove('d-none');
}

function closeAddContactOverlay(){
    document.getElementById('content-wrapper-id').classList.remove('d-none');
    let contentRef = document.getElementById('overlay-wrapper-id');
    contentRef.innerHTML = "";
    contentRef.classList.add('d-none');
}

// Templates

function renderCurrentLetter(currentLetter){
    return `
    <div class="contacts-section-header">
        <h3>${currentLetter}</h3>
        <div class="seperation-line"></div>
    </div>
    <div class="contacts-container" id="contact-container-${currentLetter}">    
    </div>`;
}

function renderCurrentContacts(index, initialien) {
    return `
        <div class="contact" id="contact-id-${index}" onclick="openContactDetailsOverlay(${index})">
            <div class="contact-avatar">${initialien}</div>
            <div class="contact-avatar-infos">
                <span>${loadedContacts[index].name}</span>
                <a href="mailto:${loadedContacts[index].email}">${loadedContacts[index].email}</a>
            </div>
        </div>
    `;
}


function HTMLopenContactDetailsOverlay(index){
    return`
    <div class="contact-details-wrapper">
        <div class="contact-detail-title-wrapper">
            <div class="page-title">
                <h1>Contacts</h1>
                <p>Better with a team</p>
                <div class="blue-line"></div>
            </div>
            <img class="arrow-left-contact-details" src="../Assets/arrow-left-line.png" alt="arrow_left" onclick="closeContactDetailsOverlay()">
        </div>  
        <div class="contact-detail-view">
            <div class="contact-avatar-and-name">
                <div class="detail-contact-avatar">${loadedContacts[index].initialien}</div>
                <h2>${loadedContacts[index].name}</h2>
            </div>
            <p>Contact Information</p>
            <h5>Email</h5>
            <a href="#">${loadedContacts[index].email}</a>
            <h5>Phone</h5>
            <a href="#">${loadedContacts[index].phone}</a>
        </div>
        <img class="three-points-menu" src="../Assets/threePointsMenu.png" alt="threePointsMenu">
    </div>
    `;
}

function HTMLOpenAddContactOverlay(){
    return`
    <div class="overlay-edit-contact">
        <div class="middle-avatar">TW</div>
            <div class="upper-half">
                <div class="cross-close" onclick="closeAddContactOverlay()">X</div>
                <div class="edit-contact-title">
                    <h1>Add contact</h1>
                    <h6>Tasks are better with a team!</h6>
                    <div class="blue-line"></div>
                </div>
            </div>
            <div class="lower-half">
                <div class="input-fields-add">
                    <input class="input-person" placeholder="Name" type="text">
                    <input class="input-mail" placeholder="Email" type="email">
                    <input class="input-phone" placeholder="Phone" type="tel">
                    <button class="create-button">Create contact<i class="fa-sharp-duotone fa-solid fa-check"></i></button>
                </div>
            </div>
        </div>
    </div>
    `;
}