import {
  Html,
  Body,
  Head,
  Heading,
  Text,
  Section,
  Container,
  Button,
} from "@react-email/components";

type Props = {
  to: string;
};

const styles = {
  main: {
    backgroundColor: "#f9f9f9",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #eaeaea",
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  text: {
    fontSize: "16px",
    color: "#555555",
    lineHeight: "1.5",
    textAlign: "center" as const,
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "4px",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
    fontWeight: "bold",
  },
  footer: {
    marginTop: "30px",
    fontSize: "14px",
    color: "#999999",
    textAlign: "center" as const,
  },
};

export default function LeanCanvasEmailTemplate({ to }: Props) {
  return (
    <Html>
      <Head />
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Welcome to Toptechschool!</Heading>

          <Text style={styles.text}>
            Thank you for your interest, <strong>{to}</strong>! Here’s your link
            to access the Lean Startup Notion template:
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button
              href="https://canary-musician-7b8.notion.site/Lean-Canvas-Template-1ac197810e70805d9f1fcbe85b189fac"
              style={styles.button}
            >
              Access Template
            </Button>
          </Section>

          <Text style={styles.footer}>
            © 2025 Toptechschool. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}