import { Input } from "../ui/input";
import { Label } from "../ui/label";
const ContactInfoForm = () => {
  return (
    <section className="contact-info py-2">
      <h2 className="text-lg font-semibold">Contact Information</h2>
      <div className="mb-2 border dark:border-gray-600 rounded-md p-2">
        <div>
          <Label className="pr-2">Phone Number</Label>
          <Input
            type="tel"
            name="phoneNumber"
            required
            placeholder="Enter your contact number"
            className="border px-1"
          />
        </div>
        <div>
          <Label className="pr-2">LinkedIn Profile</Label>
          <Input
            type="url"
            name="linkedinProfile"
            placeholder="Enter your linkedIn url"
            className="border px-1"
          />
        </div>
        <div>
          <Label className="pr-2">Website/Portfolio</Label>
          <Input
            type="url"
            name="website"
            placeholder="Enter your portfolio url"
            className="border px-1"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactInfoForm;
