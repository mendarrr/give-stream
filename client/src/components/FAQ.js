import React, { useState } from "react";
import Question from './Question';

const faqData = [
  {
    question: "What is Give Stream?",
    answer:
      "Give Stream is an automated donation platform dedicated to providing essential resources such as sanitary towels, clean water, and proper sanitation facilities to school-going girls in Sub-Saharan Africa. It also connects donors to various charities.",
  },
  {
    question: "How does Give Stream work?",
    answer:
      "Give Stream connects donors with charities that provide essential resources to those in need. Donors can select the cause they wish to support, make a donation, and track how their contributions are making a difference.",
  },
  {
    question: "Who can use Give Stream?",
    answer:
      "Give Stream is designed for three types of users: donors, charities, and administrators. Donors can make contributions, charities can manage and receive donations, and admins oversee the platform's operations.",
  },
  {
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button on the homepage, fill in the required information, and follow the instructions to complete the registration process.",
  },
  {
    question: "How can I make a donation?",
    answer:
      "To make a donation, log in to your account, select the charity or cause you wish to support, enter the donation amount, and complete the payment process using our secure payment gateway.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Many donations made through Give Stream may be tax-deductible, but this depends on the laws of your country and the status of the charity. Please consult with a tax advisor for specific information.",
  },
  {
    question: "Can I track my donations?",
    answer:
      "Yes, you can track your donations by logging into your account and viewing your donation history. You'll see details about how your contributions are being used.",
  },
  {
    question: "How do I know my donation is being used effectively?",
    answer:
      "Give Stream works with reputable charities and provides updates and reports on how donations are being used. You can also contact the charities directly for more information.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Give Stream accepts various payment methods, including credit/debit cards, PayPal, and bank transfers. The available options will be displayed during the donation process.",
  },
  {
    question: "How do I update my account information?",
    answer:
      "To update your account information, log in to your account, go to the 'Profile' section, and make the necessary changes. Be sure to save your updates.",
  },
  {
    question: "Can I cancel my donation?",
    answer:
      "Donations made through Give Stream are generally non-refundable. However, if you have a special circumstance, please contact us at [contact information] for assistance.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "If you forget your password, click on the 'Forgot Password' link on the login page, enter your email address, and follow the instructions to reset your password.",
  },
  {
    question: "How can charities join Give Stream?",
    answer:
      "Charities interested in joining Give Stream can apply by filling out the registration form on our website. Our team will review the application and get in touch with the next steps.",
  },
  {
    question: "How do I contact Give Stream support?",
    answer:
      "For any questions or support, you can contact Give Stream at [contact information]. Our support team is available to assist you with any issues or inquiries.",
  },
  {
    question: "Is my personal information safe on Give Stream?",
    answer:
      "Give Stream takes data privacy and security seriously. We implement industry-standard security measures to protect your personal information. Please review our Privacy Policy for more details.",
  },
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  
    const toggleAnswer = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  
    const toggleChatBox = () => {
      setIsChatBoxOpen(!isChatBoxOpen);
    };
  
    return (
      <div className="main-faq-container">
        <div className="faq-header">
          <h1>Questions</h1>
        </div>
        <div className="faq-container">
          <div className="card-question-container">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="faq-item"
                onClick={() => toggleAnswer(index)}
              >
                <div className="faq-question">
                  <h2>{item.question}</h2>
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="ask-form-icon-btn chat-container">
         {isChatBoxOpen && <Question onClose={toggleChatBox} />}
          <button className="chat-button" onClick={toggleChatBox}>
            <i className="fa-regular fa-message"></i>
          </button>
        </div>
      </div>
    );
  };
  
  export default FAQ;
