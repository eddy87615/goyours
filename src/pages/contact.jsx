import ContactForm from '../components/contactForm/contactForm';
import './contact.css';

export default function Contact() {
  return (
    <div className="form">
      <div>
        <div>
          <h2>打工度假、留學，就交給我們吧！放心去飛！</h2>
          <p>
            GoYours團隊集合了數位有著業界多年經驗的顧問
            無論您是想要短期進修、就讀語言學校、 國外打工度假、特定技能一號簽證
            還是想要體驗不同人生， 都歡迎背上背包來找我們，
            大家安心把出國夢交給我們吧！
          </p>
        </div>
        <div>
          <h2>聯絡GoYours</h2>
          <p>
            無論您是想要短期進修、就讀語言學校
            還是想要體驗不同人生，融入外國生活的打工度假，
            都歡迎背上背包，跟著我們 來一場喊走就走的冒險，
            留下毫無遺憾的生命足跡！ 高優生活 Just for one time! Go
            Yours！去吧！ 為了自己，踏上旅程，去你的美好人生！
          </p>
        </div>
        <div>
          <h2>打工度假、留學免費諮詢</h2>
          <p>
            不方便前來聽分享會的會員們，不用擔心！ 填寫表單我們會致電給您，
            可以另外約時間一對一諮詢， 也可以用Line、FB讓我們了解大家的需求喔 ～
            讓高優成為你們打工度假、留學圓夢的好夥伴！
          </p>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
