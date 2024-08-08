import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-text">
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`}
            alt="logo"
          />
        </Link>
        <h1>About Give Stream</h1>
        <p>
          Welcome to Give Stream, a revolutionary platform dedicated to making a
          tangible difference in the lives of those in need. Our mission is to
          provide essential resources such as sanitary towels, clean water, and
          proper sanitation facilities to school-going girls in Sub-Saharan
          Africa, ensuring they can attend school without interruption and
          achieve their full potential. Additionally, Give Stream connects
          donors to a variety of deserving charities, expanding our impact
          beyond just one cause.
        </p>

        <h2>Our Mission</h2>
        <p>
          In many parts of Sub-Saharan Africa, girls from poor families face
          significant challenges during their menstrual periods due to a lack of
          access to sanitary towels and proper hygiene facilities. This issue
          leads to frequent absenteeism, with girls missing up to 20% of school
          days annually. Our mission is to address this critical problem by
          facilitating regular donations that support the provision of menstrual
          hygiene products and the construction of clean water and sanitation
          facilities in schools.
        </p>

        <h2>Our Vision</h2>
        <p>
          At Give Stream, we envision a world where no girl has to miss school
          because of her period. We are committed to ensuring that every girl
          can attend school with dignity and confidence, regardless of her
          socioeconomic background. By providing these essential resources, we
          aim to create an environment where girls can focus on their education
          and build a brighter future for themselves and their communities.
          <br />
          Beyond this, we also strive to support a range of other impactful
          causes. By connecting donors with various deserving charities, we aim
          to address multiple social issues and extend our positive impact
          across different communities.
        </p>
      </div>

      <div className="abouttxt">
        <div className="working">
          <div className="working-text">
            <h2>How Give Stream works</h2>
            <p>
              Give Stream simplifies the donation process, making it easy for
              donors to contribute regularly to vital causes. Our platform
              allows users to set up automated, recurring donations, ensuring a
              steady stream of support for organizations dedicated to improving
              lives. Whether it's a monthly, quarterly, or annual donation, our
              system is designed to provide flexibility and convenience for our
              donors.
            </p>
          </div>
          <div className="tutorial-btn">
            <button play-btn>
              <i class="fa-solid fa-play"></i> Play 1 min Video
            </button>
          </div>
        </div>

        <div className="why">
          <h2>Why Give Stream?</h2>
          <ul>
            <li>
              Impactful Change: Your donations directly contribute to providing
              sanitary towels, clean water, and proper sanitation facilities to
              schools in need, as well as supporting other crucial charities.
            </li>
            <li>
              Sustainable Support: By setting up recurring donations, you ensure
              continuous support for various causes that improve education,
              health, and overall well-being.
            </li>
            <li>
              Transparency: We maintain full transparency with our donors,
              providing regular updates on the impact of your contributions and
              the progress of our initiatives.
            </li>
            <li>
              Community Empowerment: Supporting Give Stream means empowering
              entire communities by promoting education, health, gender
              equality, and addressing other social issues.
            </li>
          </ul>
        </div>

        <div className="join-us">
          <h2>Join Us</h2>
          <p>
            Together, we can make a significant impact on the lives of young
            girls in Sub-Saharan Africa and support other deserving charities.
            Join us in our mission to create a brighter future by ensuring those
            in need have the resources to thrive. Your generosity and commitment
            can help break the cycle of poverty and create lasting change.
            <br />
            Thank you for supporting Give Stream and being a part of this
            transformative journey.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
