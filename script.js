// Change hello svg size
const helloSvg = document.querySelector('.hello');
function setHelloSvgSize() {
    // Get intro text font size
    const introText = document.querySelector('.intro_wrapper');
    const introTextFontSize = getComputedStyle(introText).width;
    const scale = introTextFontSize.replace('px', '')/600;
    // Set hello svg size
    helloSvg.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', setHelloSvgSize);
setHelloSvgSize();

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
    inputField.addEventListener('input', () => setIconTransform(index));
});

// // Validate email
// const email = document.getElementById('email');
// email.addEventListener('input', () => {
//     const emailValidity = email.validity;
//     console.log(emailValidity);
//     switch (true) {
//         case emailValidity.valueMissing:
//             email.setCustomValidity('Please enter your email');
//             // set border to red
//         case !emailValidity.valid && emailValidity.typeMismatch:
//             let errorMsg = '';    
//             switch (true) {
//                 case !/^[^\W_].+/.test(email):
//                     errorMsg += 'Email must start with a letter\n';
//                 case !/^[^\W_][\w.\-_]+@.+/.test(email):
//                     errorMsg += 'Email can only contain letters, numbers, and symbols: . - _\n';
//                 case !//.test(email):

//                 case !//.test(email):

//                 default:
//                     errorMsg = '';
//             }
//             email.setCustomValidity(errorMsg);
//             // set border to red
//         case emailValidity.valid:
//             // set border to green
//         default:
//             email.setCustomValidity('');
//             // set border to white
//     }
// });

// Send email
$('document').ready(function() {
    $('#contact_form').on('submit', e => {
        e.preventDefault();
        // Validate email
        const email = $('#email').val();
        const content = `
        <b>Name: </b>${$('#name').val()}
        <br>
        <b>Email: </b>${$('#email').val()}
        <br>
        <b>Subject: </b>${$('#subject').val()}
        <br>
        <b>Message: </b>${$('#message').val()}
        `
        Email.send({
            SecureToken : 'f7d0d542-2898-431d-9564-28ba217abaab',
            From : 'received-contact-form@protonmail.com',
            To : 'vincentchung413@gmail.com',
            ReplyTo : $('#email').val(), 
            Subject : $('#subject').val(),
            Body : content
        }).then(
          message => alert(message)
        );
    });
});

// Observe if scrolled to About Me
// const aboutMeObserver = new IntersectionObserver(entries => {

// });

// const aboutMe = document.querySelectorAll('.hobbies_item_wrapper');

// Header Observer
const headerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {threshold: 0.8});

const headers = document.getElementsByClassName('header');
for (let i = 0; i < headers.length; i++) {
    headerObserver.observe(headers[i]);
};

// Content Wrapper Observer
const contentWrapperObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            contentWrapperObserver.unobserve(entry.target);
        };
        // About Me animation
        if (entry.target.parentElement.id == 'about_me' && entry.target.classList.contains('fade-in')) {
            const hobbies = document.getElementsByClassName('hobby');
            for (let i = 0; i < hobbies.length; i++) {
                hobbies[i].classList.add('start-animation');
                document.getElementsByClassName('time_spend')[i].classList.add('start-animation');
            };
        };
        // Learning animation
        if (entry.target.parentElement.id == 'learning' && entry.target.classList.contains('fade-in')) {
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
                    };
                };
            });
        };
    });
}, {threshold: 0.5});


const contentWrappers = document.getElementsByClassName('content_wrapper');
for (let i = 0; i < contentWrappers.length; i++) {
    console.log(contentWrappers[i]);
    contentWrapperObserver.observe(contentWrappers[i]);
};

const intro = document.querySelector('#intro');
const introPaths = intro.querySelectorAll('path');
introPaths.forEach(path => {
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    console.log(`This is ${path.id} total length: `+ path.getTotalLength());
});