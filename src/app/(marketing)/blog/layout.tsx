export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      {children}
    </div>
  );
}
