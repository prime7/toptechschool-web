import { Html } from "@react-email/html"
import { Text } from "@react-email/text"
import { Button } from "@react-email/button"
import { Container } from "@react-email/container"
import { Section } from "@react-email/section"
import { Head } from "@react-email/head"
import { Preview } from "@react-email/preview"
import { Heading } from "@react-email/heading"

interface EmailVerificationTemplateProps {
  verificationUrl: string
}

export default function EmailVerificationTemplate({ verificationUrl }: EmailVerificationTemplateProps) {
  return (
    <Html>
      <Head>
        <title>Verify Your Email</title>
      </Head>
      <Preview>Please verify your email address to complete your registration</Preview>
      <Container style={{ 
        maxWidth: "600px", 
        margin: "0 auto", 
        padding: "40px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <Section style={{ 
          padding: "30px",
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "8px"
        }}>
          <Heading style={{ 
            color: "#1a1a1a",
            fontSize: "28px",
            marginBottom: "24px",
            fontWeight: "600"
          }}>
            Verify Your Email
          </Heading>
          <Button 
            href={verificationUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "24px",
              fontWeight: "500",
              fontSize: "16px",
              boxShadow: "0 2px 4px rgba(37,99,235,0.2)"
            }}
          >
            Verify Email Address
          </Button>
          <Text style={{ 
            color: "#6b7280",
            fontSize: "14px",
            lineHeight: "1.5",
            marginTop: "24px"
          }}>
            If you did not request this verification, please ignore this email or contact support if you have concerns.
          </Text>
        </Section>
      </Container>
    </Html>
  )
}
