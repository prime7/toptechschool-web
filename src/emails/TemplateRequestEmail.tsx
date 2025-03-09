import React from "react";

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
  section: {
    textAlign: "center" as const,
  },
};

export default function TemplateRequestEmail({ to }: Props) {
  return (
    <html>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.heading}>Welcome to Toptechschool!</h1>

          <p style={styles.text}>
            Thank you for your interest, <strong>{to}</strong>! Here&apos;s your
            link to access the Lean Startup Notion template:
          </p>

          <div style={styles.section}>
            <a
              href="https://canary-musician-7b8.notion.site/Lean-Canvas-Template-1ac197810e70805d9f1fcbe85b189fac"
              style={styles.button}
            >
              Access Template
            </a>
          </div>

          <p style={styles.footer}>
            © 2025 Toptechschool. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}
