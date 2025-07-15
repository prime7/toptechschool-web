const Footer = () => {
    return (
        <footer className="w-full border-t border-border/40 bg-emerald-950 py-6">
            <p className="text-sm text-white text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} TopTechSchool. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;