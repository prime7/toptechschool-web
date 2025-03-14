import { Platform } from "@prisma/client";
import { Github, Linkedin, Twitter, Facebook, Globe, Youtube, Gamepad } from "lucide-react"


export function getSocialIcon(platform: Platform) {
  switch (platform) {
    case Platform.GITHUB:
      return <Github className="h-4 w-4" />;
    case Platform.LINKEDIN:
      return <Linkedin className="h-4 w-4" />;
    case Platform.X:
      return <Twitter className="h-4 w-4" />;
    case Platform.FACEBOOK:
      return <Facebook className="h-4 w-4" />;
    case Platform.YOUTUBE:
      return <Youtube className="h-4 w-4" />;
    case Platform.STACKOVERFLOW:
      return <Gamepad className="h-4 w-4" />;
    case Platform.PERSONAL_WEBSITE:
      return <Globe className="h-4 w-4" />;
    case Platform.PORTFOLIO:
      return <Gamepad className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}