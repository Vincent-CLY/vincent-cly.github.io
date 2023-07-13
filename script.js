const navContainer = document.querySelector('.nav_container');
const navIcon = document.querySelector('.nav_icon');
const textContent = document.querySelectorAll('.text_content');

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
        navContainer.classList.remove('active');
        navIcon.classList.remove('active');
        if (textContent.classList.contains('active')) {
            for (let eachTextContent of textContent) {
                eachTextContent.classList.toggle('active');
            }
        }
    }
})

// q: Can you suggest some of the mordern color palettes for the website? 
// a: https://www.canva.com/colors/color-palettes/
// a: https://colorhunt.co/
// a: https://coolors.co/
// a: https://color.adobe.com/create/color-wheel
// q: Can you suggest some of the mordern font pairings for the website?
// a: https://www.canva.com/font-combinations/
// a: https://fontjoy.com/
// a: https://www.typewolf.com/google-fonts
// a: https://www.fontsquirrel.com/
// a: https://fonts.google.com/
// q: I have chose to use #201A1E, #D0B49F, #E4D4C8, and #E2E6E7 for my web coloring using in canva.com. Can you help to decide which color to use in webpage background, div bakground, text color, and navigation bar color?
// a: #201A1E for webpage background
// a: #D0B49F for div background
// a: #E4D4C8 for text color
// a: #E2E6E7 for navigation bar color