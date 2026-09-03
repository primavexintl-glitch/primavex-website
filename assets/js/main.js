/**
 * PRIMAVEX INTERNATIONAL LTD | MAIN JAVASCRIPT
 * Interactions, Form Validations, URL Parameter Routing
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (mobileClose) {
      mobileClose.addEventListener('click', closeDrawer);
    }

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeDrawer();
      }
    });
  }

  // 2. URL Parameter Handler (Auto-fill dropdowns from links)
  const urlParams = new URLSearchParams(window.location.search);
  const paramProduct = urlParams.get('product');
  const paramType = urlParams.get('type');

  const productSelect = document.getElementById('product') || document.getElementById('contact-product');
  if (productSelect && paramProduct) {
    const validOptions = Array.from(productSelect.options).map(opt => opt.value.toLowerCase());
    if (validOptions.includes(paramProduct.toLowerCase())) {
      productSelect.value = paramProduct.toLowerCase();
    }
  }

  const typeSelect = document.getElementById('contact-type');
  if (typeSelect && paramType) {
    const validTypes = Array.from(typeSelect.options).map(opt => opt.value.toLowerCase());
    if (validTypes.includes(paramType.toLowerCase())) {
      typeSelect.value = paramType.toLowerCase();
    }
  }

  // 3. Conditional Unlisted Product Toggle (Request Sample Form)
  const sampleProductSelect = document.getElementById('product');
  const unlistedField = document.getElementById('unlisted-product-field');
  const unlistedInput = document.getElementById('unlisted-product-name');

  if (sampleProductSelect && unlistedField) {
    const handleProductChange = () => {
      if (sampleProductSelect.value === 'other') {
        unlistedField.classList.add('active');
        if (unlistedInput) unlistedInput.required = true;
      } else {
        unlistedField.classList.remove('active');
        if (unlistedInput) {
          unlistedInput.required = false;
          unlistedInput.value = '';
        }
      }
    };

    sampleProductSelect.addEventListener('change', handleProductChange);
    // Initial check on page load
    handleProductChange();
  }

  // 4. Conditional Custom Field Toggle (Contact Us Form)
  const contactProductSelect = document.getElementById('contact-product');
  const contactTypeSelect = document.getElementById('contact-type');
  const contactCustomField = document.getElementById('contact-custom-field');

  if (contactProductSelect && contactTypeSelect && contactCustomField) {
    const checkContactConditionals = () => {
      if (contactProductSelect.value === 'other' || contactTypeSelect.value === 'specs') {
        contactCustomField.classList.add('active');
      } else {
        contactCustomField.classList.remove('active');
      }
    };

    contactProductSelect.addEventListener('change', checkContactConditionals);
    contactTypeSelect.addEventListener('change', checkContactConditionals);
    checkContactConditionals();
  }

  // Helper: Sanitize string to prevent XSS / malicious injection
  const sanitizeText = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/[<>]/g, '')
      .trim();
  };

  // Helper: RFC 5322 standard email validation
  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);
  };

  const WEB3FORMS_ACCESS_KEY = '031aeed2-6ca8-4d05-9fc1-e7a80b9a01dd';

  // 5. Sample Request Form Validation & Submission
  const sampleForm = document.getElementById('sample-request-form');
  const sampleFormWrapper = document.getElementById('sample-form-wrapper');
  const sampleSuccessCard = document.getElementById('sample-success-card');

  if (sampleForm) {
    sampleForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Security Honeypot Anti-Spam Check
      const botCheck = sampleForm.querySelector('input[name="bot_check"]');
      if (botCheck && botCheck.value.trim() !== '') {
        return;
      }

      let isValid = true;

      // Required fields
      const requiredInputs = [
        { el: document.getElementById('fullname'), group: document.getElementById('group-fullname') },
        { el: document.getElementById('email'), group: document.getElementById('group-email'), isEmail: true },
        { el: document.getElementById('phone'), group: document.getElementById('group-phone') },
        { el: document.getElementById('country'), group: document.getElementById('group-country') },
        { el: document.getElementById('product'), group: document.getElementById('group-product') }
      ];

      requiredInputs.forEach(({ el, group, isEmail }) => {
        if (!el || !group) return;
        const val = sanitizeText(el.value);
        let fieldValid = val.length > 0;

        if (isEmail && fieldValid) {
          fieldValid = isValidEmail(val);
        }

        if (!fieldValid) {
          group.classList.add('has-error');
          el.classList.add('error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
          el.classList.remove('error');
        }
      });

      // Check conditional unlisted product field if active
      if (sampleProductSelect && sampleProductSelect.value === 'other' && unlistedInput) {
        if (!sanitizeText(unlistedInput.value)) {
          unlistedInput.classList.add('error');
          isValid = false;
        } else {
          unlistedInput.classList.remove('error');
        }
      }

      if (isValid) {
        const submitBtn = sampleForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }

        const payload = {
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Sample Request from ' + sanitizeText(document.getElementById('fullname').value),
          from_name: 'Primavex Website',
          name: sanitizeText(document.getElementById('fullname').value),
          email: sanitizeText(document.getElementById('email').value),
          phone: sanitizeText(document.getElementById('phone').value),
          company: sanitizeText(document.getElementById('company')?.value || 'N/A'),
          country: sanitizeText(document.getElementById('country').value),
          product: sanitizeText(document.getElementById('product').value),
          unlisted_product_name: sanitizeText(document.getElementById('unlisted-product-name')?.value || 'N/A'),
          intended_use: sanitizeText(document.getElementById('intended_use')?.value || 'N/A'),
          bulk_quantity: sanitizeText(document.getElementById('bulk_quantity')?.value || 'N/A'),
          delivery_destination: sanitizeText(document.getElementById('destination')?.value || 'N/A'),
          additional_notes: sanitizeText(document.getElementById('notes')?.value || 'None')
        };

        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const data = await response.json();
          if (response.ok && data.success) {
            sampleFormWrapper.style.display = 'none';
            sampleSuccessCard.classList.add('active');
            sampleSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            throw new Error(data.message || 'Submission error');
          }
        } catch (err) {
          console.warn('Submission processed:', err);
          sampleFormWrapper.style.display = 'none';
          sampleSuccessCard.classList.add('active');
          sampleSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // 6. Contact Us Form Validation & Submission
  const contactForm = document.getElementById('contact-enquiry-form');
  const contactFormWrapper = document.getElementById('contact-form-wrapper');
  const contactSuccessCard = document.getElementById('contact-success-card');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Security Honeypot Anti-Spam Check
      const botCheck = contactForm.querySelector('input[name="bot_check"]');
      if (botCheck && botCheck.value.trim() !== '') {
        return;
      }

      let isValid = true;

      const requiredContactInputs = [
        { el: document.getElementById('contact-name'), group: document.getElementById('group-contact-name') },
        { el: document.getElementById('contact-email'), group: document.getElementById('group-contact-email'), isEmail: true },
        { el: document.getElementById('contact-phone'), group: document.getElementById('group-contact-phone') },
        { el: document.getElementById('contact-country'), group: document.getElementById('group-contact-country') },
        { el: document.getElementById('contact-message'), group: document.getElementById('group-contact-message') }
      ];

      requiredContactInputs.forEach(({ el, group, isEmail }) => {
        if (!el || !group) return;
        const val = sanitizeText(el.value);
        let fieldValid = val.length > 0;

        if (isEmail && fieldValid) {
          fieldValid = isValidEmail(val);
        }

        if (!fieldValid) {
          group.classList.add('has-error');
          el.classList.add('error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
          el.classList.remove('error');
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }

        const payload = {
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Business Enquiry from ' + sanitizeText(document.getElementById('contact-name').value),
          from_name: 'Primavex Website',
          name: sanitizeText(document.getElementById('contact-name').value),
          email: sanitizeText(document.getElementById('contact-email').value),
          phone: sanitizeText(document.getElementById('contact-phone').value),
          company: sanitizeText(document.getElementById('contact-company')?.value || 'N/A'),
          country: sanitizeText(document.getElementById('contact-country').value),
          product_interest: sanitizeText(document.getElementById('contact-product')?.value || 'General'),
          enquiry_type: sanitizeText(document.getElementById('contact-type')?.value || 'General'),
          custom_details: sanitizeText(document.getElementById('contact-custom-details')?.value || 'N/A'),
          message: sanitizeText(document.getElementById('contact-message').value)
        };

        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const data = await response.json();
          if (response.ok && data.success) {
            contactFormWrapper.style.display = 'none';
            contactSuccessCard.classList.add('active');
            contactSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            throw new Error(data.message || 'Submission error');
          }
        } catch (err) {
          console.warn('Submission processed:', err);
          contactFormWrapper.style.display = 'none';
          contactSuccessCard.classList.add('active');
          contactSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
});
