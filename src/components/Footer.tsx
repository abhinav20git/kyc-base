import React from "react";

const Footer = ({isDarkTheme}) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={`border-t ${isDarkTheme? 'bg-zinc-900 border-zinc-800':'bg-background'} `}>
      <div className="container mx-auto px-4 py-3 text-center text-sm text-muted-foreground">
        <p>
          © {currentYear} KYC Verify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;



