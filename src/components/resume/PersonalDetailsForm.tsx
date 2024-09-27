import { Input } from "../ui/input";
import { Label } from "../ui/label";

const PersonalDetailsForm = () => {
  return (
    <section className="personal-details py-2">
      <h2 className="text-lg font-semibold">Personal Details</h2>
      <div className="mb-2 border dark:border-gray-600 rounded-md p-2">
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
          <Label className="pr-2">Role you are applying for:</Label>
          <Input type="text" name="role" required className="px-2" />
        </div>
        <div>
          <Label className="pr-2">Location</Label>
          <Input type="text" name="location" required className="px-2" />
        </div>
      </div>
    </section>
  );
};

export default PersonalDetailsForm;
