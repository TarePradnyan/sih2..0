document.addEventListener('DOMContentLoaded', () => {
    const phoneForm = document.getElementById('phoneForm');
    const otpForm = document.getElementById('otpForm');
    const phoneInput = document.getElementById('phone');
    const otpInput = document.getElementById('otp');
    const phoneError = document.getElementById('phoneError');
    const otpError = document.getElementById('otpError');

    // Handle Phone Number Form Submission
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneNumber = phoneInput.value;
        if (!validatePhoneNumber(phoneNumber)) {
            phoneError.textContent = 'Please enter a valid 10-digit number.';
            phoneError.style.visibility = 'visible';
            return;
        }

        phoneError.style.visibility = 'hidden';
        
        // ✅ Demo: Sending OTP (console only)
        console.log(`Sending OTP to ${phoneNumber}`);
        alert('OTP sent successfully! (Demo OTP: 123456)');
        
        // Show OTP form, hide phone form
        phoneForm.classList.add('hidden');
        otpForm.classList.remove('hidden');
        otpInput.focus();
    });

    // Handle OTP Form Submission
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const otp = otpInput.value;
        if (!validateOtp(otp)) {
            otpError.textContent = 'Please enter a valid 6-digit OTP.';
            otpError.style.visibility = 'visible';
            return;
        }

        otpError.style.visibility = 'hidden';

        // ✅ Demo OTP check
        if (otp === '123456') {
            console.log('OTP verified. Login successful!');
            alert('Login successful! Redirecting to Home...');

            // ✅ Save login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', phoneInput.value);

            // Redirect to Home
            window.location.href = '../index.html'; 
        } else {
            otpError.textContent = 'Incorrect OTP. Please try again.';
            otpError.style.visibility = 'visible';
        }
    });

    // Simple validation functions
    function validatePhoneNumber(number) {
        const regex = /^\d{10}$/;
        return regex.test(number);
    }

    function validateOtp(otp) {
        const regex = /^\d{6}$/;
        return regex.test(otp);
    }
});
