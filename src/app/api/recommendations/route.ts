import { NextResponse } from "next/server";
import books from "@/lib/books.json";

interface Book {
  title: string;
  category: string;
  amazonLink: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interests } = body;

    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json(
        { error: "Interests must be an array of strings." },
        { status: 400 }
      );
    }

    const recommendedBooks = books.filter((book: Book) => {
      const bookCategory = book.category.toLowerCase();
      return interests.some((interest: string) =>
        bookCategory.includes(interest.toLowerCase())
      );
    });

    return NextResponse.json(recommendedBooks);
  } catch (error) {
    console.error("Error in recommendation API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
