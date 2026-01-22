import { BackgroundImage } from './BackgroundImage';

export function AuthLayout({
  children,
  backgroundImageUrl,
}: {
  children: React.ReactNode;
  backgroundImageUrl: string;
}) {
  return (
    <div className="bg-primary-100 flex h-screen w-screen">
      <BackgroundImage image={backgroundImageUrl} />
      <div className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden bg-white shadow-md md:m-4 md:rounded-2xl">
        {children}
      </div>
    </div>
  );
}
