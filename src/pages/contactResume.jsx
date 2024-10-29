import ContactFormResume from '../components/contactForm-resume/contactFormResume';
import './contactResume.css';
import { useLocation } from 'react-router-dom';

export default function ContactResume() {
  const location = useLocation();
  const jobTitle =
    location.state?.initialMessage || '聯絡GoYours，打工度假、留學免費諮詢';

  return (
    <div className="contactusSection">
      <div className="contactusResume">
        <div className="contactusTitle">
          <h1 className="jobapplyh1">{jobTitle}——打工度假申請</h1>
        </div>
      </div>
      <ContactFormResume />
    </div>
  );
}
