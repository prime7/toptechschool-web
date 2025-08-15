"use client";

import { useState } from "react";
import { Section } from "@/components/common/Section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateUserInterests } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Heart, Search } from "lucide-react";

interface Book {
  title: string;
  category: string;
  amazonLink: string;
}

export default function RecommendationsPage() {
  const [interests, setInterests] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendedBooks([]);

    const interestsArray = interests.split(",").map((i) => i.trim());

    try {
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

      try {
        const result = await updateUserInterests(interestsArray);
        if (result.success) {
          toast({
            title: "Success",
            description: "Your interests have been saved to your profile.",
          });
        }
      } catch (saveError) {
        console.warn("Could not save user interests.", saveError);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while fetching recommendations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No recommendations yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your interests above to discover books tailored for you.
      </p>
    </div>
  );

  const renderNoResults = () => (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No books found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&apos;t find any books for your interests. Try a broader
        search.
      </p>
    </div>
  );

  return (
    <Section className="container mx-auto py-8 md:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Personalized Book Recommendations
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover books that align with your career goals and technical
          interests.
        </p>
      </div>

      <Card className="mt-8 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Find Your Next Read</CardTitle>
          <CardDescription>
            Enter your interests (e.g., JavaScript, AI, DevOps) to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Type your interests here..."
              className="flex-grow"
            />
            <Button
              onClick={handleGetRecommendations}
              disabled={isLoading || !interests}
              className="w-full sm:w-auto"
            >
              {isLoading
                ? "Searching..."
                : "Get Recommendations"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12">
        {isLoading
          ? renderBookSkeletons()
          : hasSearched
          ? recommendedBooks.length > 0
            ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedBooks.map((book) => (
                  <Card key={book.title} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <CardDescription>{book.category}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <a
                          href={book.amazonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Book className="mr-2 h-4 w-4" />
                          View on Amazon
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )
            : renderNoResults()
          : renderEmptyState()}
      </div>
    </Section>
  );
}
