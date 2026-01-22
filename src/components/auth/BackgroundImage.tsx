export function BackgroundImage({ image }: { image?: string }) {
  return (
    <img
      className={`bg-opacity-50 hidden bg-center bg-no-repeat p-6 md:block md:min-w-2/5 lg:min-w-1/2`}
      src={image}
    />
  );
}
