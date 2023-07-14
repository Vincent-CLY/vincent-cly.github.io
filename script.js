const navContainer = document.querySelector('.nav_container');
const navIcon = document.querySelector('.nav_icon');
const textContent = document.querySelectorAll('.text_content');
const sectionHeader = document.querySelector('.section_header');
const headerTextCount = sectionHeader.innerText.length;

// Set steps() number to CSS animation
sectionHeader.style.setProperty('--header-text-count', headerTextCount);

// Change typing-cursor-effect color
sectionHeader.addEventListener('animationiteration', e => {
    if (e.elapsedTime === 1.5) {
        sectionHeader.style.setProperty('--header-text-color', 'var(--header-text-right-color)');
    }
})

// Change typing-cursor-effect style
sectionHeader.addEventListener('animationend', e => {
    if (e.animationName === 'typing-words-effect') {
        sectionHeader.style.setProperty('--header-cursor-effect', 'alternate');
    }
    console.log(e);
});

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
