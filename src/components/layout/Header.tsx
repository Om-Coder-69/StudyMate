import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
}

export default function Header({ showBackButton = false, backHref = '/' }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 mr-2" asChild>
              <Link href={backHref}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          )}
          <BookOpen className="h-8 w-8" />
          <Link href="/" className="text-2xl font-bold">
            StudyTube
          </Link>
        </div>
        {/* Placeholder for potential future actions like settings or profile */}
      </div>
    </header>
  );
}
