import { HelmetProvider, Helmet } from "react-helmet-async";

import ContactFormResumeJob from "../components/contactForm-resume-job/contactFormResume";
import "./contactResume.css";

export default function ContactResume() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours職缺申請表單</title>
        <meta name="description" content="填寫表單，讓Go Yours幫你媒合工作！" />
      </Helmet>
      <div className="contactusSection">
        <div className="contactusResume"></div>
        <ContactFormResumeJob />
      </div>
    </HelmetProvider>
  );
}
