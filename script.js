// Change typing-cursor-effect text
const toolkit = document.querySelector('[data-toolkit]');
const toolkitArr = ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Regex', 'Python', 'C++', 'PHP', 'SQL'];
let i = 1;
toolkit.innerText = toolkitArr[0];
toolkit.style.setProperty('--header-text-count', toolkit.innerText.length);

toolkit.addEventListener('animationiteration', e => {
    if (e.animationName === 'toolkit-typing' && e.pseudoElement === '::after') {
        toolkit.innerText = languagesArr[i];
        // Set steps() number to CSS animation
        toolkit.style.setProperty('--header-text-count', toolkit.innerText.length);
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