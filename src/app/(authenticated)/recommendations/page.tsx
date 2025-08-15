"use client";

import { useState } from "react";
import { Section } from "@/components/common/Section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserInterests } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";

interface Book {
  title: string;
  category: string;
  amazonLink: string;
}

export default function RecommendationsPage() {
  const [interests, setInterests] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendedBooks([]);

    const interestsArray = interests.split(",").map((i) => i.trim());

    try {
      // Get recommendations
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests: interestsArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations.");
      }

      const books = await response.json();
      setRecommendedBooks(books);

      // Attempt to save interests to profile, but don't block on failure
      try {
        const result = await updateUserInterests(interestsArray);
        if (result.success) {
          toast({
            title: "Success",
            description: "Your interests have been saved.",
          });
        }
      } catch (saveError) {
        console.warn("Could not save user interests.", saveError);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="mt-4">
      <h1 className="text-4xl font-bold">Book Recommendations</h1>
      <p className="text-muted-foreground">
        Enter your interests and skills (comma-separated) to get personalized
        book recommendations.
      </p>
      <div className="mt-8 flex gap-4">
        <Input
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g., JavaScript, Software Architecture, DevOps"
          className="max-w-lg"
        />
        <Button onClick={handleGetRecommendations} disabled={isLoading}>
          {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
        </Button>
      </div>

      {recommendedBooks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Recommended Books</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedBooks.map((book) => (
              <Card key={book.title}>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Category: {book.category}
                  </p>
                  <Button asChild className="mt-4">
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Amazon
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
