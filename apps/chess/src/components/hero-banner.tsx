import {Spotlight} from "@/components/spotlight";
import {Badge} from "@artic-frost/ui/components";


function HeroBanner() {
  return (
    <div className="relative overflow-hidden lg:min-h-screen flex flex-col items-start lg:items-center justify-center">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <Badge
        variant="secondary"
        size="sm"
        className="top-4 right-4 absolute invisible lg:visible">
        Public Alpha
      </Badge>
      <div className="gap-4 flex flex-col items-center text-center">
        <Badge variant="secondary" className="block lg:hidden" size="sm">
          Public Alpha
        </Badge>
        <h1 className="h1 pb-1 font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50">
          Make chess cool, again
        </h1>
        <p className="text-muted-foreground text-center max-w-[600px]">
          Easily play with friends or engine and enjoy the timeless game.
          Analyze, review games and much more.
        </p>
        <div className="flex flex-col lg:flex-row gap-4 justify-center mt-4">
         Todo
        </div>
      </div>
    </div>
  );
}

export {HeroBanner};
