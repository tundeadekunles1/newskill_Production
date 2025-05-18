import React from "react";
import section1Image from "../assets/3mtt2.jpg";
import section2Image from "../assets/3mtt3.png";
function LandingPage() {
  return (
    <div>
      <section className="image-container">
        <img src={section1Image} alt="Background" className="section1Image" />
        <div className="overlay-text">
          <h1>Learn Something New, Teach What You Know.</h1>
          <h3>
            Join a global skill sharing community where learning and teaching
            goes hand in hand. Become a pro in what you love! Your skills have
            value. Share them
          </h3>
          <p>FIND & SHARE SKILLS</p>
        </div>
      </section>

      <section className="section2">
        <div className="section2div1">
          <h1>Learn, Teach and Connect Seamlessly</h1>
          <h4>
            SkillBridge is designed to foster meaningful skill exchange through
            interactive and collaborative learning. Built on proven learning
            principles, our platform helps you connect with like-minded
            individuals. Share your expertise, and gain new skills in an
            engaging and fun way
          </h4>
          <h2>Transform Online Learning Into Real-World Impact.</h2>
        </div>
        <div>
          <img
            src={section2Image}
            alt="section2Image"
            className="section2Image"
          />
        </div>
      </section>
      <section className="section3">
        <div className="section3-content1">
          <p>Connect with others on</p>
          <p>SkillBridge</p>
        </div>
        <p className="section3-content1">Easy Process</p>
        <div className="section3-content2">
          <h4 className="section3-content3">
            Create an account with SkillBridge to become a member, and all
            services will be available for you
          </h4>
          <h4 className="section3-content3">
            Give details of what you have to offer to other members .
          </h4>
          <h4 className="section3-content3">
            Browse through various categories of talent offers and connect with
            others to exchange skills.
          </h4>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
