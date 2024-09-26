import { Input } from "../ui/input";
import { Label } from "../ui/label";

const PersonalDetailsForm = () => {
  return (
    <section className="personal-details py-2">
      <h2>Personal Details</h2>
      <div>
        <Label className="pr-2">Full Name</Label>
        <Input
          type="text"
          name="name"
          required
          placeholder="Enter your full name"
          className="border px-1"
        />
      </div>
      <div>
        <Label className="pr-2">Email</Label>
        <Input
          type="email"
          name="email"
          required
          placeholder="Enter your email address"
          className="border px-1"
        />
      </div>
      <div>
        <Label className="pr-2">Date of Birth</Label>
        <Input type="date" name="dob" className="px-2" />
      </div>
    </section>
  );
};

export default PersonalDetailsForm;
