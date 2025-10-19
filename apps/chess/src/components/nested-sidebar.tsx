/**
 * NestedSidebar is a component that create a nested sidebar inside the main sidebar.
 */
function NestedSidebar({children}: {children: React.ReactNode}) {
  return (
    <div className="lg:w-[320px] lg:min-w-[320px] lg:max-w-[600px] lg:border-l border-t lg:border-t-none">
      <div className="overflow-y-auto lg:max-h-[calc(100svh-theme(spacing.20))]">
        {children}
      </div>
    </div>
  );
}

export {NestedSidebar};
