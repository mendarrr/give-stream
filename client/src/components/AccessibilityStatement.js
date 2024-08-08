import React from "react";
import "./HomePage.css";

const AccessibilityStatement = () => {
  return (
    <div className="accessibility">
      <h1>Accessibility Statement</h1>
      <p>
        Give Stream is committed to ensuring digital accessibility for people
        with disabilities. We are continually improving the user experience for
        everyone and applying the relevant accessibility standards.
      </p>

      <h2>1. Measures to Support Accessibility</h2>
      <p>We take the following measures to ensure accessibility:</p>
      <ul>
        <li>Include accessibility as part of our mission statement.</li>
        <li>Integrate accessibility into our procurement practices.</li>
        <li>Provide continual accessibility training for our staff.</li>
      </ul>

      <h2>2. Conformance Status</h2>
      <p>
        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA. We are continuously working to ensure that all content on our
        platform meets these standards.
      </p>

      <h2>3. Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of Give Stream. Please let
        us know if you encounter accessibility barriers:
      </p>
      <ul>
        <li>Email: [helpdesk@givestream.com]</li>
        <li>Phone: [+2541 920 9074]</li>
      </ul>

      <h2>4. Technical Specifications</h2>
      <p>
        Accessibility of Give Stream relies on the following technologies to
        work with the particular combination of web browser and any assistive
        technologies or plugins installed on your computer:
      </p>
      <ul>
        <li>React</li>
        <li>Flask</li>
        <li>ARIA roles and properties</li>
        <li>Screen readers</li>
        <li>Keyboard navigation</li>
        <li>Visual contrast</li>
        <li>Color contrast</li>
        <li>Text alternatives</li>
        <li>Content descriptions</li>
        <li>Audio descriptions</li>
        <li>Labeling and ARIA attributes</li>
      </ul>

      <h2>5. Assessment Approach</h2>
      <p>
        Give Stream assesses the accessibility of its platform through
        self-evaluation and third-party evaluations.
      </p>

      <h2>6. Date</h2>
      <p>This statement was last updated on [3rd August, 2024].</p>
    </div>
  );
};

export default AccessibilityStatement;
