import React from "react";
import "./HomePage.css";
import Navbar from "./Navbar";

const TermsOfUse = () => {
  return (
    <>
    <Navbar />
    <div className="terms">
      <h3>Effective Date: [2nd August, 2024]</h3>
      <h4>Terms of Use</h4>
      <p>
        Welcome to Give Stream. By using our platform, you agree to the
        following terms and conditions:
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Give Stream, you accept and agree to be bound by
        these Terms of Use. If you do not agree to these terms, please do not
        use our platform.
      </p>

      <h2>2. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms of Use at any time. We will
        notify you of any changes by posting the new terms on our platform. Your
        continued use of the platform after any such changes constitutes your
        acceptance of the new Terms of Use.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To use certain features of Give Stream, you must create an account. You
        are responsible for maintaining the confidentiality of your account
        information and for all activities that occur under your account.
      </p>

      <h2>4. Donations</h2>
      <p>
        Donors can make donations to charities listed on Give Stream. All
        donations are final and non-refundable. We are not responsible for how
        charities use the funds they receive.
      </p>

      <h2>5. Prohibited Conduct</h2>
      <p>
        You agree not to use Give Stream for any unlawful purpose or in any way
        that could harm, disable, overburden, or impair the platform.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All content on Give Stream, including text, graphics, logos, and images,
        is the property of Give Stream or its content suppliers and protected by
        intellectual property laws.
      </p>

      <h2>7. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your account at any time,
        with or without cause or notice.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        Give Stream is provided "as is" and "as available" without warranties of
        any kind, either express or implied.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        In no event shall Give Stream be liable for any direct, indirect,
        incidental, special, or consequential damages arising out of or in
        connection with your use of the platform.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms of Use are governed by and construed in accordance with the
        laws of [State of Delaware], without regard to its conflict of law
        principles.
      </p>
    </div>
    </>
  );
};

export default TermsOfUse;
