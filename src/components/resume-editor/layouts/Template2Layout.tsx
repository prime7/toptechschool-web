import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import type { ResumeData } from "../types";
// You might want to import section components here as well if Template 2 uses them
// import { PersonalSection, SummarySection, ... } from "../ResumePDFDocument";

interface Template2LayoutProps {
  resumeData: ResumeData;
  styles: any; // Replace 'any' with a more specific type if available
}

const Template2Layout: React.FC<Template2LayoutProps> = ({
  resumeData,
  styles,
}) => {
  // const { personal, summary, ... } = resumeData; // Destructure as needed

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Template 2 Layout</Text>
        <Text>
          This is a placeholder for Template 2. You would structure your PDF
          content for Template 2 here, potentially reusing section components
          or creating new ones.
        </Text>
        {/* Example: Render personal section if active */}
        {/* {resumeData.activeSections.includes("personal") && (
          <View style={styles.section}>
            <Text style={styles.itemHeader}>{resumeData.personal.fullName}</Text>
            // ... more personal info details specific to Template 2 layout
          </View>
        )} */}
      </View>
    </Page>
  );
};

export default Template2Layout;
