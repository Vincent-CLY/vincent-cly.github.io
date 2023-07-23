const navContainer = document.querySelector('.nav_container');
const navIcon = document.querySelector('.nav_icon');
const sectionHeader = document.querySelector('[data-section-header]');
const headerTextCount = sectionHeader.innerText.split('\n').join('').length;

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

// Change Arrow to Visible Class
// Function to Check if Element is Visible
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    const viewportWidth = (window.innerWidth || document.documentElement.clientWidth);
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.right <= viewportWidth
    );
}
// Function to Set Arrow to be Visible
function setVisible(element) {
    if (!element.classList.contains('visible')) {   
        element.classList.add('visible');
        console.log(element.dataset);
    }
}
// Initial First Arrow
const invisibleArrow = document.querySelectorAll('[data-arrow="invisible"]');
setVisible(invisibleArrow[0]);
// For Each Arrow Expect First Arrow 
document.addEventListener('scroll', () => {
    for (let eachArrow of invisibleArrow) {
        if (isInViewport(eachArrow)) {
            setVisible(eachArrow);
            eachArrow.dataset.arrow = 'visible';
        }
    }    
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
