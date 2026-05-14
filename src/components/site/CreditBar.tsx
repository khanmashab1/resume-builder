import mashabPic from "@/assets/mashab.jpg";

export function CreditBar() {
  return (
    <div className="w-full bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-xs sm:text-sm">
        <img
          src={mashabPic}
          alt="Mashab Jaddon"
          className="h-6 w-6 rounded-full object-cover ring-1 ring-background/30"
        />
        <span className="opacity-90">Crafted by</span>
        <span className="font-semibold tracking-tight">Mashab Jaddon</span>
      </div>
    </div>
  );
}
