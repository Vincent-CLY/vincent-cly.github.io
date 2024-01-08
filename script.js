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
        iconWrappers[index].style.transform = 'translate(13.5svw, -30px) scale(0.9)';
    }
    else {
        iconWrappers[index].style.transform = 'translate(14svw, -5px) scale(1)';
    };
};
contactInputs.forEach(function (inputField, index) {
    inputField.addEventListener('focus', () => iconWrappers[index].style.transform = 'translate(13.5svw, -30px) scale(0.9)');
    inputField.addEventListener('blur', () => setIconTransform(index));
    inputField.addEventListener('input', () => setIconTransform(index));
});

// // Validate email
// const email = document.getElementById('email');
// email.addEventListener('input', () => {
//     const emailValidity = email.validity;
//     console.log(emailValidit™™y);
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

// Header Observer
const headerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
        else {
            entry.target.classList.remove('fade-in');
        }
    });
}, {threshold: 0.8});

const headers = document.getElementsByClassName('header');
for (let i = 0; i < headers.length; i++) {
    headerObserver.observe(headers[i]);
};

// Content Wrapper Observer
const toolkit = document.querySelector('[data-toolkit]');
const toolkitArr = ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Regex', 'Python', 'C++', 'PHP', 'SQL', 'AJAX'];
let toolkitIndex = 0;
// Change typing-cursor-effect text
toolkit.innerText = toolkitArr[toolkitIndex];
toolkit.style.setProperty('--header-text-count', toolkit.innerText.length);
const contentWrapperObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
        else {
            entry.target.classList.remove('fade-in');
        };
        // About Me animation
        const hobbies = document.getElementsByClassName('hobby');
        const timeSpend = document.getElementsByClassName('time_spend');
        if (entry.target.parentElement.id == 'about_me' && entry.target.classList.contains('fade-in')) {
            for (let i = 0; i < hobbies.length; i++) {
                hobbies[i].classList.add('start-animation');
                timeSpend[i].classList.add('start-animation');
            };
        }
        else {
            for (let i = 0; i < hobbies.length; i++) {
                hobbies[i].classList.remove('start-animation');
                timeSpend[i].classList.remove('start-animation');
            }
        };
        // Learning animation
        if (entry.target.parentElement.id == 'learning' && entry.target.classList.contains('fade-in')) {

            toolkit.addEventListener('animationiteration', e => {
                if (e.animationName === 'toolkit-typing' && e.pseudoElement === '::after') {
                    toolkitIndex++;
                    if (toolkitIndex === toolkitArr.length) {
                        toolkitIndex = 0;
                    };
                    toolkit.innerText = toolkitArr[toolkitIndex];
                    // Set steps() number to CSS animation
                    toolkit.style.setProperty('--header-text-count', toolkit.innerText.length);
                };
            });
        };
    });
}, {threshold: 0.2});

const contentWrappers = document.getElementsByClassName('content_wrapper');
for (let i = 0; i < contentWrappers.length; i++) {
    contentWrapperObserver.observe(contentWrappers[i]);
};

// Form Observer
const formObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
        else {
            entry.target.classList.remove('fade-in');
        };
    });
}, {threshold: 0.2});

const form = document.getElementsByClassName('contact_form');
formObserver.observe(form[0]);



// Animate intro svg
const intro = document.querySelector('#intro');
const introPaths = intro.querySelectorAll('path');
introPaths.forEach(path => {
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
});


// Nav bar
const navContainers = document.querySelectorAll('.nav_items_container');
const checkBox = document.querySelector('.menu-icon input');
checkBox.addEventListener('change', function() {
    if(this.checked) {
        let i = 0;
        navContainers.forEach(navContainer => {
            navContainer.style.transitionDelay = `${i * 50}ms`;
            navContainer.classList.add('checked');
            i++;
        });
    } else {
        let i = 4;
        navContainers.forEach(navContainer => {
            navContainer.style.transitionDelay = `${i * 50}ms`;       
            i--;
            navContainer.classList.remove('checked');
        });
    };
});

window.addEventListener('click', e => {
    // Get the header element
    const header = document.querySelector('header');

    // Check if the click event's target is inside the header
    if (!header.contains(e.target)) {
        // If it's not, set checkBox.checked to false
        checkBox.checked = false;

        // Update the navContainers
        let i = 4;
        navContainers.forEach(navContainer => {
            navContainer.style.transitionDelay = `${i * 50}ms`;
            i--;
            navContainer.classList.remove('checked');
        });
    }
});

// Slide in project benefits
const projectBenefits = document.querySelectorAll('.project-benefit');
// console.log(projectBenefits);
// projectBenefits.forEach(projectBenefit => {
//     projectBenefit.classList.add('slide-in');
//     console.log('adding slide-in');
// });
const projectBenefitsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        console.log(entry.isIntersecting);
        entry.target.classList.toggle('slide-in', entry.isIntersecting);
    });
}, {threshold: 0});

projectBenefits.forEach(projectBenefit => {
    projectBenefitsObserver.observe(projectBenefit);
});