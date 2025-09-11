import GlobalLoader from '@/components/GlobalLoader';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <GlobalLoader />
    </div>
  );
}
