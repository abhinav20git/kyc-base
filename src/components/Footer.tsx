import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          © {currentYear} KYC Verify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;



