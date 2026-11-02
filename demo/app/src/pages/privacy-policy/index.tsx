// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-C9x7MnxX (3)
import { useQueryState, parseAsString } from "nuqs";
import * as i from "react/jsx-runtime";
import { _s } from "@/with-error-boundary";
import { l } from "@/components/privacyColicies/PrivacyColicies";
const C = _s(l);
const PrivacyPolicy = () => {
  const [e] = useQueryState("lang", parseAsString);
  if (!e || e === "en") {
    return (
      <div className="flex flex-col gap-[8px] p-[32px] italic">
        <h1> Confidentiality and information protection</h1>{" "}
        <ul>
          <li>
            <b>PROVISION OF INFORMATION BY THE CLIENT:</b>
          </li>
        </ul>{" "}
        <div>
          1.1. The Client's personal data is processed in accordance with Law of the Republic of
          Uzbekistan, 'On Personal Data' No. LRU-547.
        </div>
        <div>
          {" "}
          1.2. When registering on the site app.uysot.uz, the Client provides the following
          information: Last name, First name, contact phone number.
        </div>{" "}
        <div>
          1.3. By providing his personal data, the Client agrees to their processing (up to the
          withdrawal by the Client of his consent to the processing of his personal data) by Softex
          PC, in order to fulfill the obligations of the Seller and / or its partners to the Client,
          provide services, providing reference information, customer support and for the purpose of
          promoting services, and also agrees to receive promotional and informational messages and
          service messages.
        </div>{" "}
        <div>
          1.4. The processing of personal data means any action (operation) or a set of actions
          (operations) performed with or without the use of automation tools with personal data,
          including collection, recording, systematization, accumulation, storage, clarification
          (updating, changing), retrieval , use, transfer (including transfer to third parties, not
          excluding cross-border transfer, if the need for it arose in the course of fulfilling
          obligations), depersonalization, blocking, deletion, destruction of personal data.
        </div>{" "}
        <div>
          1.5. If the Client wishes to clarify his personal data, block or destroy them if the
          personal data is incomplete, outdated, inaccurate, illegally obtained or not necessary for
          the stated purpose of processing, or if the client wishes to withdraw his consent to the
          processing of personal data or eliminate illegal actions of Softex PC in relation to his
          personal data, he must send a written application about this to the Seller at the e-mail
          address: info@softex.uz.{" "}
        </div>
        <div>
          1.6. The Seller uses the data provided by the Client during the entire period of
          registration of the Client on the Site in order to:
          <ul>
            <li>registration/authorization of the Client on the Site;</li>
            <li>providing customer support;</li>
            <li> providing background information; </li>
            <li>to fulfill its obligations to the Client; </li>
            <li>to carry out activities to promote services;</li>
            <li>PROVISION AND TRANSFER OF INFORMATION RECEIVED BY THE SELLER:</li>
          </ul>
        </div>{" "}
        <div>
          2.1. The Seller undertakes not to transfer the information received from the Client to
          third parties. It is not considered a violation that the Seller provides information to
          agents and third parties acting on the basis of an agreement with the Seller in order to
          fulfill obligations to the Client and only within the framework of agreements. The
          transfer by the Seller to third parties of data about the Client in an anonymized form for
          the purpose of evaluating and analyzing the operation of the Site, analyzing the
          purchasing characteristics of the Client and providing personal recommendations is not
          considered a violation of this clause.
        </div>{" "}
        <div>
          2.2. It is not considered a violation of obligations to transfer information in accordance
          with the reasonable and applicable requirements of the legislation of the Uzbekistan
          Republic.
        </div>{" "}
        <div>
          2.3. The Seller has the right to use 'cookies' technology. Cookies do not contain
          confidential information and are not transferred to third parties.{" "}
        </div>
        <div>
          2.4. The Seller receives information about the ip-address of the visitor to the Site
          app.uysot.uz and information about the link from which Internet site the visitor followed.
          This information is not used to identify the visitor.
        </div>
        <div>
          2.5. The Seller is not responsible for the information provided by the Client on the Site
          in a public form.{" "}
        </div>
        <div>
          2.6. The seller, when processing personal data, takes the necessary and sufficient
          organizational and technical measures to protect personal data from unauthorized access to
          them, as well as from other illegal actions in relation to personal data.
        </div>{" "}
        <ul>
          <li>
            <b>STORAGE AND USE OF INFORMATION BY THE CLIENT </b>
          </li>
        </ul>
        <div>
          3.1. The Client undertakes not to disclose to third parties the login and password used by
          him for authorization in the system.
        </div>{" "}
        <div>
          3.2. The Client undertakes to ensure due diligence when storing and using the login and
          password (including, but not limited to: use licensed anti-virus programs, use complex
          alphanumeric combinations when creating a password, not provide third parties with a
          computer or other equipment with entered on it login and password of the Client, etc.)
        </div>
        <div>
          3.3. If the Seller has suspicions about the use of the Client's account by a third party
          or malicious software, the Seller has the right to unilaterally change the Client's
          password.{" "}
        </div>
        <div>
          3.4 When you connect Google services to your Uysot account, we request the use of Google
          OAuth scopes. These are needed for the following reasons:{" "}
          <ul>
            <li>
              {" "}
              <a
                href="https://www.googleapis.com/auth/calendar"
                className="text-[#4a90e2] hover:text-[#4a90e2] "
              >
                https://www.googleapis.com/auth/calendar
              </a>
              : This scope is needed in order to read/write within your synchronized calendars
            </li>
          </ul>
        </div>{" "}
        <div>
          3.5 You may update, correct, or delete your Account information and preferences at any
          time by accessing your Account settings page in the Service.
        </div>{" "}
        <br />
        <ul>
          <li>
            <b>Security</b>
          </li>
        </ul>{" "}
        <div>
          We value your trust in providing us your Personal Information, thus we are striving to use
          commercially acceptable means of protecting it. But remember that no method of
          transmission over the internet, or method of electronic storage is 100% secure and
          reliable, and we cannot guarantee its absolute security.
        </div>
      </div>
    );
  }
  return <C />;
};
const g = _s(PrivacyPolicy);
export default g;
