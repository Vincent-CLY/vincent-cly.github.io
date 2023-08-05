// Change typing-cursor-effect text
const languages = document.querySelector('[data-languages]');
const languagesArr = ['HTML', 'CSS', 'JavaScript', 'Python', 'C++', 'PHP', 'SQL'];
let i = 1;
languages.innerText = languagesArr[0];
languages.style.setProperty('--header-text-count', languages.innerText.length);

languages.addEventListener('animationiteration', e => {
    if (e.animationName === 'languages-typing' && e.pseudoElement === '::after') {
        languages.innerText = languagesArr[i];
        // Set steps() number to CSS animation
        languages.style.setProperty('--header-text-count', languages.innerText.length);
        i++;
        if (i === languagesArr.length) {
            i = 0;
        }
    }
});

// Change hello svg size
const helloSvg = document.querySelector('.hello');
window.addEventListener('resize', () => {
    // Get intro text font size
    const introText = document.querySelector('.intro');
    const introTextFontSize = getComputedStyle(introText).fontSize;
    const scale = introTextFontSize.replace('px', '')/140;
    // Set hello svg size
    helloSvg.style.transform = `scale(${scale})`;
});