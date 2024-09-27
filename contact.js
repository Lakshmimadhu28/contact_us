class ContactForm {
    constructor(formId, displayDivId) {
        this.form = document.getElementById(formId);
        this.displayDiv = document.getElementById(displayDivId);

        // Bind event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Real-time validation
        this.addRealTimeValidation();

        // Load and display all form submissions on page load
        this.displayAllFormData();
    }

    // Method to handle form submission
    handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission behavior

        // Grab input values
        const formData = this.collectFormData();

        // Validate inputs
        if (!this.validateFormData(formData)) {
            alert("Please fill out all required fields.");
            return;
        }

        // Store form data
        this.storeFormData(formData);

        // Display all submitted data
        this.displayAllFormData();

        // Clear form after submission
        this.form.reset();

        // Optional: Add success message
        alert("Form submitted successfully!");
    }

    // Method to collect form data
    collectFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim(),
            queryType: document.querySelector('input[name="queryType"]:checked')?.value,
            consent: document.querySelector('input[name="consent"]').checked ? 'Yes' : 'No'
        };
    }

    // Method to validate form data
    validateFormData(formData) {
        let isValid = true;

        // First Name Validation
        if (!formData.firstName) {
            this.showError('firstName', "Please fill");
            isValid = false;
        } else {
            this.showSuccess('firstName');
        }

        // Last Name Validation
        if (!formData.lastName) {
            this.showError('lastName', "Please fill");
            isValid = false;
        } else {
            this.showSuccess('lastName');
        }

        // Email Validation (simple regex)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            this.showError('email', "Please fill with a valid email");
            isValid = false;
        } else {
            this.showSuccess('email');
        }

        // Message Validation
        if (!formData.message || formData.message.length < 10) {
            this.showError('message', "Please fill with at least 10 characters");
            isValid = false;
        } else {
            this.showSuccess('message');
        }

        // Query Type Validation
        if (!formData.queryType) {
            this.showErrorRadio('queryType', "Please select a query type");
            isValid = false;
        } else {
            this.showSuccessRadio('queryType');
        }

        // Consent Validation
        if (formData.consent === 'No') {
            this.showError('consent', "Please consent to being contacted");
            isValid = false;
        } else {
            this.showSuccess('consent');
        }

        return isValid;
    }

    // Store form data in localStorage
    storeFormData(formData) {
        let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        submissions.push(formData);
        localStorage.setItem('submissions', JSON.stringify(submissions));
    }

    // Display all submitted form data
    displayAllFormData() {
        const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        this.displayDiv.innerHTML = ''; // Clear previous data

        submissions.forEach((data, index) => {
            this.displayDiv.innerHTML += `
                <h3>Submission ${index + 1}</h3>
                <p><strong>First Name:</strong> ${data.firstName}</p>
                <p><strong>Last Name:</strong> ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Query Type:</strong> ${data.queryType}</p>
                <p><strong>Message:</strong> ${data.message}</p>
                <p><strong>Consent to Contact:</strong> ${data.consent}</p>
                <hr>
            `;
        });
    }

    // Show validation error
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = 'red';
        field.nextElementSibling.innerHTML = message;
    }

    // Show validation success
    showSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = 'green';
        field.nextElementSibling.innerHTML = '';
    }

    // Show validation error for radio buttons
    showErrorRadio(groupName, message) {
        const fieldGroup = document.querySelectorAll(`input[name="${groupName}"]`);
        fieldGroup.forEach(field => field.parentNode.style.borderColor = 'red');
        document.querySelector(`.${groupName}-error`).innerHTML = message;
    }

    // Show validation success for radio buttons
    showSuccessRadio(groupName) {
        const fieldGroup = document.querySelectorAll(`input[name="${groupName}"]`);
        fieldGroup.forEach(field => field.parentNode.style.borderColor = 'green');
        document.querySelector(`.${groupName}-error`).innerHTML = '';
    }

    // Add real-time validation
    addRealTimeValidation() {
        const fields = ['firstName', 'lastName', 'email', 'message'];
        fields.forEach(fieldId => {
            document.getElementById(fieldId).addEventListener('input', () => {
                this.validateFormData(this.collectFormData());
            });
        });

        // For radio buttons
        document.querySelectorAll('input[name="queryType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.validateFormData(this.collectFormData());
            }); 
        });

        // For consent checkbox
        document.querySelector('input[name="consent"]').addEventListener('change', () => {
            this.validateFormData(this.collectFormData());
        });
    }
}

// Create an instance of the ContactForm class
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('contactForm', 'dataDisplay');
});
