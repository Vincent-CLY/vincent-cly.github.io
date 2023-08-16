// Change typing-cursor-effect text
const toolkit = document.querySelector('[data-toolkit]');
const toolkitArr = ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Regex', 'Python', 'C++', 'PHP', 'SQL', 'AJAX'];
let i = 1;
toolkit.innerText = toolkitArr[0];
toolkit.style.setProperty('--header-text-count', toolkit.innerText.length);

toolkit.addEventListener('animationiteration', e => {
    if (e.animationName === 'toolkit-typing' && e.pseudoElement === '::after') {
        toolkit.innerText = toolkitArr[i];
        // Set steps() number to CSS animation
        toolkit.style.setProperty('--header-text-count', toolkit.innerText.length);
        i++;
        if (i === toolkitArr.length) {
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

// Contact form textarea auto expand
const message = document.querySelector('#message');
message.addEventListener('input', e => {
    message.style.height = '30px';
    message.style.height = `${message.scrollHeight-3}px`;
});

// Set contact form icon transform
const contactInputs = document.querySelectorAll('[data-form]');
const iconWrappers = document.querySelectorAll('.icon_wrapper');

function setIconTransform(index) {
    if (contactInputs[index].value.length > 0) {
        iconWrappers[index].style.transform = 'translateY(-30px) scale(0.9)';
    }
    else {
        iconWrappers[index].style.transform = 'translateY(0px) scale(1)';
    };
};
contactInputs.forEach(function (inputField, index) {
    inputField.addEventListener('focus', () => iconWrappers[index].style.transform = 'translateY(-30px) scale(0.9)');
    inputField.addEventListener('blur', () => setIconTransform(index));
});

// Validate input email
function emailValidate() {
    const email = document.querySelector('#email');
    if (!email.value.match(/(^\w[\w-]+)@([\w-]+\.)+([a-z]{2,4})/g)) {
        
    }
}