const navContainer = document.querySelector('.nav_container');
const navIcon = document.querySelector('.nav_icon');
const textContent = document.querySelectorAll('.text_content');
const sectionHeader = document.querySelector('.section_header');
const headerTextCount = sectionHeader.innerText.split('\n').join('').length;
const r = document.querySelector(':root');
const button = document.querySelector('button');


// Able To Click Menu 
navIcon.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    navIcon.classList.toggle('active');
    for (let eachTextContent of textContent) {
        eachTextContent.classList.toggle('active');
    }
})

// Able To Click Away The Menu
document.addEventListener('click', e => {
    if (!navIcon.contains(e.target)) {
        if (navContainer.classList.contains('active')) {
            for (let eachTextContent of textContent) {
                eachTextContent.classList.remove('active');
            }
        }
        navContainer.classList.remove('active');
        navIcon.classList.remove('active');
    }
})
console.log('Before')
// Set steps() number to CSS animation
function testing() {
    r.style.setProperty('--header-text-count', headerTextCount);
    console.log(headerTextCount);
}
console.log('After')