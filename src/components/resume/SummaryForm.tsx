import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const SummaryForm = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold">Summary</h2>
      <div className="mb-2 border dark:border-gray-600 rounded-md p-2">
        <div>
          <Label>Profile</Label>
          <Textarea
            name="Profile"
            placeholder="write something about yourself"
          />
        </div>
      </div>
    </section>
  );
};
export default SummaryForm;
