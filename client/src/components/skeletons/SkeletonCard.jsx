// components/SkeletonCard.tsx
const SkeletonCard = () => (
    <div class="animate-pulse">
      <div class="h-96 bg-gray-800 rounded mb-4"></div>
      <div class="px-5 py-4">
        <div class="mb-2">
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
          <div class="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div class="h-16 bg-gray-200 rounded"></div>
        <div class="mt-3 mb-2">
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
      );
      
      export default SkeletonCard;
      