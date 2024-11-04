import SideMenu from "@/components/custom/SideMenu";

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex ">
      <div className="h-[37rem] max-md:hidden md:block md:w-1/4 lg:w-1/5 flex ">
        <SideMenu />
      </div>
      {children}
    </div>
  );
}
