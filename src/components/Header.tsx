import { useState } from "react";

interface HeaderProps {}

const Header = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-4">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        {!imgError ? (
          <img
            src="/ng-logo.png"
            alt="National Guard Logo"
            className="h-12 w-12 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">NG</span>
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            National Guard Class Schedule
          </h1>
          <p className="text-sm text-muted-foreground">Weekly schedule submission</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
