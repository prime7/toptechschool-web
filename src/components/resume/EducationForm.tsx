import { Input } from "../ui/input";
import { Label } from "../ui/label";
const EducationForm = () => {
  return (
    <section className="education py-2">
      <h2>Education</h2>
      <div>
        <Label className="pr-2">Institution Name</Label>
        <Input
          type="text"
          name="institutionName"
          required
          placeholder="Enter your institute name"
          className="border px-1"
        />
      </div>
      <div>
        <Label>Degree</Label>
        <Input type="text" name="degree" required />
      </div>
      <div>
        <Label>Start Year</Label>
        <Input type="date" name="startYear" />
      </div>
      <div>
        <Label>End Year</Label>
        <Input type="date" name="endYear" />
      </div>
    </section>
  );
};

export default EducationForm;
