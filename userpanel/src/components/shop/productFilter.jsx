export default function ProductFilter({ totalItems, uniqueVariations }) {
  return (
    <div className="flex pb-6 justify-between items-center pt-2 ">
      <div>1</div>
      <div>
        <span className="text-base leading-[22px]">{totalItems} Items</span>
      </div>
      <div>3</div>
    </div>
  );
}
