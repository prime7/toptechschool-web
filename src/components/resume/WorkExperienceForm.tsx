import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
const WorkExperienceForm = () => {
  return (
    <section className="work-experience">
      <h2>Work Experience</h2>
      <div>
        <Label>Job Title</Label>
        <Input type="text" name="jobTitle" required />
      </div>
      <div>
        <Label>Company Name</Label>
        <Input type="text" name="companyName" required />
      </div>
      <div>
        <Label>Start Date</Label>
        <Input type="date" name="startDate" />
      </div>
      <div>
        <Label>End Date</Label>
        <Input type="date" name="endDate" />
      </div>
      <div>
        <Label>Job Description</Label>
        <Textarea name="jobDescription" />
      </div>
    </section>
  );
};

export default WorkExperienceForm;
